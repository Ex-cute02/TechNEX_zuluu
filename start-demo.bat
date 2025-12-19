@echo off
echo 🚀 Starting Mutual Fund API Demo
echo.

echo Step 1: Starting local backend server...
echo Backend will run on http://localhost:8000
echo.

cd backend
start "Backend Server" cmd /k "python run.py"

echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo.
echo Step 2: Starting ngrok tunnel...
echo This will make your local backend accessible from the internet
echo.

start "Ngrok Tunnel" cmd /k "ngrok http 8000"

echo.
echo 🎉 Demo setup complete!
echo.
echo Next steps:
echo 1. Wait for ngrok to start (check the ngrok window)
echo 2. Copy the ngrok HTTPS URL (e.g., https://abc123.ngrok.io)
echo 3. Update your frontend environment variable
echo 4. Your deployed frontend will connect to your local backend!
echo.
echo Frontend URL: https://frontend-zeta-ten-86.vercel.app
echo Backend URL: http://localhost:8000
echo Ngrok URL: Check the ngrok window
echo.
echo Press any key to open the backend in browser...
pause >nul

start http://localhost:8000

echo.
echo Demo is running! Press Ctrl+C in the backend window to stop.
pause