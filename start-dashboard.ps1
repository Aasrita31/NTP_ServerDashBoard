# IITTNIF NTP Dashboard Startup Script
# Run this from anywhere - it will start both backend and frontend on correct ports

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "IITTNIF NTP Dashboard Startup" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

$rootDir = "C:\Users\USER\Desktop\ntp_server\global-sync-station-main"
$backendDir = "$rootDir\backend"
$frontendDir = "$rootDir\frontend"

# Kill any existing processes
Write-Host "Cleaning up existing processes..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -match "node|python"} | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Start Backend
Write-Host "Starting Backend (Port 8000)..." -ForegroundColor Green
Start-Process PowerShell -ArgumentList "-NoExit", "-Command", "cd '$backendDir'; python -m uvicorn app.main:app --host 0.0.0.0 --port 8000" -WindowStyle Normal

Start-Sleep -Seconds 3

# Start Frontend
Write-Host "Starting Frontend (Port 8080)..." -ForegroundColor Green
Start-Process PowerShell -ArgumentList "-NoExit", "-Command", "cd '$frontendDir'; npm run dev" -WindowStyle Normal

Start-Sleep -Seconds 5

# Open Browser
Write-Host "Opening dashboard in browser..." -ForegroundColor Green
Start-Process "http://localhost:8080"

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "✅ Dashboard is starting!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:8080" -ForegroundColor Cyan
Write-Host "Backend:  http://localhost:8000" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop any terminal" -ForegroundColor Yellow
