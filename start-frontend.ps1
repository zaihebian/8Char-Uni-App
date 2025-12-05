# Start Frontend Development Server
# Run: .\start-frontend.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Frontend Development Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check .env.development file
$envPath = ".env.development"
if (-not (Test-Path $envPath)) {
    Write-Host "Creating .env.development file..." -ForegroundColor Yellow
    $envContent = @"
VITE_API_URL=http://localhost:3000
"@
    Set-Content -Path $envPath -Value $envContent -Encoding UTF8
    Write-Host "✓ .env.development file created" -ForegroundColor Green
} else {
    Write-Host "✓ .env.development file exists" -ForegroundColor Green
}

# Check dependencies
Write-Host ""
Write-Host "Checking dependencies..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host "✓ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✓ Dependencies exist" -ForegroundColor Green
}

# Start development server
Write-Host ""
Write-Host "Starting frontend development server..." -ForegroundColor Yellow
Write-Host "App will open in browser automatically" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""

npm run dev:h5
