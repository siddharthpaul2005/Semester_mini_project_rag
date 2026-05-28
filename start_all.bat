@echo off
echo Starting up all AI Tutor services for you...

echo [1/3] Starting Local AI (Ollama)...
start "Ollama AI Engine" cmd /k "ollama serve"

echo [2/3] Starting FastAPI Backend Server...
start "FastAPI Backend" cmd /k "cd backend && c:\AI-Tutor\.venv\Scripts\activate && uvicorn main:app --reload"

echo [3/3] Starting React Frontend Server...
start "React Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ==============================================
echo All three services are launching in their own separate windows!
echo Once the startup is complete, your app should be running nicely.
echo Press any key to close this launcher...
pause >nul
