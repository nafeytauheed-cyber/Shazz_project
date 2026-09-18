$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$backend = Join-Path $projectRoot 'backend'
$frontend = Join-Path $projectRoot 'frontend'
$python = 'C:\Program Files\Python313\python.exe'
$node = 'C:\Program Files\nodejs\node.exe'

if (-not (Test-Path $python)) { $python = 'python' }
if (-not (Test-Path $node)) { $node = 'node' }
$npm = 'C:\Program Files\nodejs\npm.cmd'
if (-not (Test-Path $npm)) { $npm = 'npm' }

if (-not (Test-Path (Join-Path $frontend 'node_modules'))) {
    Write-Host 'Installing frontend packages...' -ForegroundColor Yellow
    & $npm --prefix $frontend install
}
if (-not (Test-Path (Join-Path $frontend '.next'))) {
    Write-Host 'Building frontend...' -ForegroundColor Yellow
    & $npm --prefix $frontend run build
}

Write-Host 'Starting Sherpa backend on http://localhost:8000 ...' -ForegroundColor Cyan
Start-Process -FilePath $python -ArgumentList '-m','uvicorn','app.main:app','--host','0.0.0.0','--port','8000' -WorkingDirectory $backend

Write-Host 'Starting Sherpa frontend on http://localhost:3000 ...' -ForegroundColor Cyan
Start-Process -FilePath $node -ArgumentList 'node_modules/next/dist/bin/next','start','-p','3000' -WorkingDirectory $frontend

$backendReady = $false
$frontendReady = $false
for ($attempt = 1; $attempt -le 15; $attempt++) {
    try { Invoke-WebRequest 'http://localhost:8000/api/health' -UseBasicParsing -TimeoutSec 2 | Out-Null; $backendReady = $true } catch {}
    try { Invoke-WebRequest 'http://localhost:3000/login' -UseBasicParsing -TimeoutSec 2 | Out-Null; $frontendReady = $true } catch {}
    if ($backendReady -and $frontendReady) { break }
    Start-Sleep -Seconds 1
}

if (-not $backendReady -or -not $frontendReady) {
    throw "Sherpa did not start correctly. Backend ready: $backendReady; frontend ready: $frontendReady"
}

Write-Host ''
Write-Host 'Sherpa is running and connected.' -ForegroundColor Green
Write-Host 'Open: http://localhost:3000' -ForegroundColor Green
Write-Host 'Backend: http://localhost:8000' -ForegroundColor Gray
