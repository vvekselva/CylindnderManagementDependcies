param(
    [Parameter(Mandatory=$false)]
    [string]$AssetDirectory = ".",

    [Parameter(Mandatory=$false)]
    [string]$Repository = "vvekselva/CylindnderManagementDependcies",

    [Parameter(Mandatory=$false)]
    [string]$Tag = "bl001-traceability-20260828-134"
)

$ErrorActionPreference = "Stop"

$matrixJson = Join-Path $AssetDirectory "traceability-matrix.json"
$matrixJs   = Join-Path $AssetDirectory "matrix-data.js"
$checksum   = Join-Path $AssetDirectory "bl001-traceability-sha256.txt"
$notes      = Join-Path $AssetDirectory "release-notes.md"

$expectedJson = "0285af7d4d8aaf90c27005f42c6ca7a384ea03009501542c5233847003562331"
$expectedJs   = "211af64b99d69fb95c889c236403ffc4b81327bdf4ba74b6ccf5c86d60e95613"

foreach ($path in @($matrixJson, $matrixJs, $checksum, $notes)) {
    if (-not (Test-Path $path)) {
        throw "Required file not found: $path"
    }
}

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    throw "GitHub CLI (gh) is not installed or not available in PATH."
}

$jsonHash = (Get-FileHash -Algorithm SHA256 $matrixJson).Hash.ToLowerInvariant()
$jsHash   = (Get-FileHash -Algorithm SHA256 $matrixJs).Hash.ToLowerInvariant()

if ($jsonHash -ne $expectedJson) {
    throw "traceability-matrix.json SHA-256 mismatch. Expected $expectedJson, got $jsonHash"
}
if ($jsHash -ne $expectedJs) {
    throw "matrix-data.js SHA-256 mismatch. Expected $expectedJs, got $jsHash"
}

Write-Host "SHA-256 validation passed for both canonical assets."

$existing = gh release view $Tag --repo $Repository --json isDraft,tagName 2>$null
if ($LASTEXITCODE -eq 0) {
    $release = $existing | ConvertFrom-Json
    if (-not $release.isDraft) {
        throw "Release $Tag already exists and is published. Refusing to overwrite immutable/versioned evidence."
    }
    Write-Host "Draft release already exists: $Tag"
} else {
    gh release create $Tag `
        --repo $Repository `
        --draft `
        --title "BL-001 Traceability Matrix - 134 Endpoint Snapshot" `
        --notes-file $notes
    if ($LASTEXITCODE -ne 0) { throw "Failed to create draft release $Tag" }
}

gh release upload $Tag `
    $matrixJson `
    $matrixJs `
    $checksum `
    --repo $Repository `
    --clobber
if ($LASTEXITCODE -ne 0) { throw "Failed to upload release assets." }

$assetJson = gh release view $Tag --repo $Repository --json assets,isDraft,tagName
if ($LASTEXITCODE -ne 0) { throw "Failed to read back release after upload." }
$releaseInfo = $assetJson | ConvertFrom-Json
$names = @($releaseInfo.assets | ForEach-Object { $_.name })
foreach ($required in @("traceability-matrix.json", "matrix-data.js", "bl001-traceability-sha256.txt")) {
    if ($names -notcontains $required) {
        throw "Read-back validation failed: missing release asset $required"
    }
}

Write-Host "Release asset read-back passed. Publishing draft release..."
gh release edit $Tag --repo $Repository --draft=false
if ($LASTEXITCODE -ne 0) { throw "Failed to publish release $Tag" }

Write-Host "Published release: $Tag"
Write-Host "Repository: $Repository"
Write-Host "Assets validated before upload and confirmed after upload."
