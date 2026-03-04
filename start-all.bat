@echo off
echo Starting VidyāMitra Application...
echo.
echo Starting Backend Server...
start "VidyāMitra Backend" cmd /k "cd backend && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"
timeout /t 3 /nobreak >nul
echo.
echo Starting Frontend Server...
start "VidyāMitra Frontend" cmd /k "cd web && npm run dev"
echo.
echo Both servers are starting...
echo Backend will be available at: http://127.0.0.1:8000
echo Frontend will be available at: http://localhost:5173
echo.
echo Press any key to exit this window (servers will continue running)...
pause >nul

