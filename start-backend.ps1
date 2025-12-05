# Start DeepSeek Backend Proxy Server
# Run: .\start-backend.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "DeepSeek Backend Proxy Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check .env file
$envPath = "backend-example\.env"
if (-not (Test-Path $envPath)) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    $envContent = @"
DEEPSEEK_API_KEY=your_api_key_here
PORT=3000
"@
    Set-Content -Path $envPath -Value $envContent -Encoding UTF8
    Write-Host "✓ .env file created" -ForegroundColor Green
} else {
    Write-Host "✓ .env file exists" -ForegroundColor Green
}

# Check dependencies
Write-Host ""
Write-Host "Checking dependencies..." -ForegroundColor Yellow
if (-not (Test-Path "backend-example\node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    Set-Location backend-example
    npm install
    Set-Location ..
    Write-Host "✓ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✓ Dependencies exist" -ForegroundColor Green
}

# Start server
Write-Host ""
Write-Host "Starting backend server..." -ForegroundColor Yellow
Write-Host "Server will run on http://localhost:3000" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""

Set-Location backend-example
npm start
