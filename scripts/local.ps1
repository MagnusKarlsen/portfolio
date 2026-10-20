param(
  [ValidateSet('install', 'dev', 'check', 'build', 'preview', 'verify')]
  [string]$Task = 'dev'
)

$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$nodeVersion = (Get-Content -LiteralPath (Join-Path $projectRoot '.node-version') -Raw).Trim()
$toolsRoot = Join-Path $projectRoot '.tools'
$runtimeRoot = Join-Path $toolsRoot "node-v$nodeVersion-win-x64"
$localNode = Join-Path $runtimeRoot 'node.exe'

# Use an existing Node >=24, otherwise a project-local portable runtime.
$nodeCommand = Get-Command node -ErrorAction SilentlyContinue
$useGlobal = $false
if ($nodeCommand) {
  $version = & $nodeCommand.Source --version
  $useGlobal = [int]($version.TrimStart('v').Split('.')[0]) -ge 24
}

if (!$useGlobal) {
  if (!(Test-Path -LiteralPath $localNode)) {
    New-Item -ItemType Directory -Path $toolsRoot -Force | Out-Null
    $archiveName = "node-v$nodeVersion-win-x64.zip"
    $archivePath = Join-Path $toolsRoot $archiveName
    $downloadRoot = "https://nodejs.org/dist/v$nodeVersion"
    Write-Host "Downloading Node.js $nodeVersion to .tools/ ..."
    $ProgressPreference = 'SilentlyContinue'
    Invoke-WebRequest -UseBasicParsing -Uri "$downloadRoot/$archiveName" -OutFile $archivePath
    $checksums = (Invoke-WebRequest -UseBasicParsing -Uri "$downloadRoot/SHASUMS256.txt").Content
    $checksumLine = ($checksums -split "`n" | Where-Object { $_.Trim().EndsWith("  $archiveName") })
    if (!$checksumLine) { throw 'Official SHA256 checksum not found.' }
    $expectedHash = ($checksumLine.Trim() -split '\s+')[0]
    $actualHash = (Get-FileHash -LiteralPath $archivePath -Algorithm SHA256).Hash
    if ($actualHash -ine $expectedHash) { throw 'SHA256 mismatch. The download will not be used.' }
    Expand-Archive -LiteralPath $archivePath -DestinationPath $toolsRoot -Force
    Remove-Item -LiteralPath $archivePath
  }
  $env:PATH = "$runtimeRoot;$env:PATH"
}

Push-Location -LiteralPath $projectRoot
try {
  if ($Task -eq 'install' -or !(Test-Path -LiteralPath (Join-Path $projectRoot 'node_modules/astro/package.json'))) {
    if (Test-Path -LiteralPath (Join-Path $projectRoot 'package-lock.json')) { & npm.cmd ci }
    else { & npm.cmd install }
    if ($LASTEXITCODE -ne 0) { throw "npm install failed with exit code $LASTEXITCODE" }
  }
  if ($Task -ne 'install') {
    & npm.cmd run $Task
    if ($LASTEXITCODE -ne 0) { throw "npm run $Task failed with exit code $LASTEXITCODE" }
  }
} finally {
  Pop-Location
}
