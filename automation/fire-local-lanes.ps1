param(
    [string]$SourceRoot = "",
    [string]$ControlRoot = "",
    [switch]$PushResults
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($ControlRoot)) {
    $ControlRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
}

if ([string]::IsNullOrWhiteSpace($SourceRoot)) {
    if (-not [string]::IsNullOrWhiteSpace($env:CYLINDER_SOURCE_ROOT)) {
        $SourceRoot = $env:CYLINDER_SOURCE_ROOT
    } else {
        $candidate = Join-Path (Split-Path $ControlRoot -Parent) "CylinderManagement"
        if (Test-Path $candidate) {
            $SourceRoot = (Resolve-Path $candidate).Path
        }
    }
}

if ([string]::IsNullOrWhiteSpace($SourceRoot) -or -not (Test-Path $SourceRoot)) {
    throw "CylinderManagement source checkout was not found. Pass -SourceRoot <path> or set CYLINDER_SOURCE_ROOT."
}

$python = $null
$py = Get-Command py -ErrorAction SilentlyContinue
if ($py) {
    $python = @($py.Source, "-3")
} else {
    $p = Get-Command python -ErrorAction SilentlyContinue
    if ($p) { $python = @($p.Source) }
}
if (-not $python) {
    throw "Python 3 is required for the local lane executor. Install Python 3 or make py/python available on PATH."
}

$executor = Join-Path $ControlRoot "automation\local-lane-executor.py"
$dispatch = Join-Path $ControlRoot "backlog\runtime\BL-001\lane-dispatch.yaml"

Write-Host "Cylinder local parallel lane fire"
Write-Host "Control root : $ControlRoot"
Write-Host "Source root  : $SourceRoot"
Write-Host "Dispatch     : $dispatch"
Write-Host "Workers      : up to 10 local OS processes"

$argsList = @()
if ($python.Count -gt 1) { $exe = $python[0]; $argsList += $python[1..($python.Count-1)] } else { $exe = $python[0] }
$argsList += @($executor, "--control-root", $ControlRoot, "--source-repo", $SourceRoot, "--dispatch", $dispatch, "--max-workers", "10")

& $exe @argsList

if ($LASTEXITCODE -eq 0 -and $PushResults) {
    Write-Host "Local execution completed. Synchronizing generated evidence to GitHub..."
    $branch = (& git -C $ControlRoot branch --show-current).Trim()
    if ($branch -ne "chore/rename-dependency-files") {
        throw "Refusing automatic push: control repository must be on chore/rename-dependency-files, current branch is '$branch'."
    }
    & git -C $ControlRoot add -- "backlog/runtime/BL-001/local-execution.yaml" "backlog/runtime/BL-001/lane-status.yaml" "logs/runs/LOCAL-BL001-*.md" "worker/evidence/LOCAL-BL001-*"
    $changes = & git -C $ControlRoot status --porcelain -- "backlog/runtime/BL-001/local-execution.yaml" "backlog/runtime/BL-001/lane-status.yaml" "logs/runs" "worker/evidence"
    if ($changes) {
        & git -C $ControlRoot commit -m "Record BL-001 local parallel lane execution"
        if ($LASTEXITCODE -ne 0) { throw "Git commit of local execution evidence failed." }
        & git -C $ControlRoot push origin HEAD
        if ($LASTEXITCODE -ne 0) { throw "Git push of local execution evidence failed. Evidence remains committed locally." }
        Write-Host "Generated execution evidence pushed to GitHub."
    } else {
        Write-Host "No generated execution changes needed to be pushed."
    }
}

exit $LASTEXITCODE
