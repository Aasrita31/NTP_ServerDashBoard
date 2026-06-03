@echo off
echo.
echo ====================================
echo IITTNIF NTP Dashboard Startup
echo ====================================
echo.

REM Kill existing processes
echo Cleaning up existing processes...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM python.exe >nul 2>&1
timeout /t 2 /nobreak >nul

REM Navigate to directories and start services
echo.
echo Starting Backend (Port 8000)...
start "Backend - NTP Server" cmd /k "cd C:\Users\USER\Desktop\ntp_server\global-sync-station-main\backend && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000"

timeout /t 3 /nobreak >nul

echo.
echo Starting Frontend (Port 8080)...
start "Frontend - Dashboard" cmd /k "cd C:\Users\USER\Desktop\ntp_server\global-sync-station-main\frontend && npm run dev"

timeout /t 5 /nobreak >nul

echo.
echo Opening dashboard in browser...
start http://localhost:8080

echo.
echo ====================================
echo IITTNIF Dashboard is starting!
echo Frontend: http://localhost:8080
echo Backend:  http://localhost:8000
echo ====================================
echo.
echo Keep this window open. Close individual terminals to stop services.
pause
