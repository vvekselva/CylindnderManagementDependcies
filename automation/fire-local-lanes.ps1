param(
    [string]$SourceRoot = "",
    [string]$ControlRoot = ""
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
exit $LASTEXITCODE
