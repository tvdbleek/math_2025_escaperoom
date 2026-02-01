@echo off
TITLE Math Escaperoom Server Launcher
CLS

ECHO ========================================================
ECHO      Math Escaperoom Server - Auto Launcher
ECHO ========================================================
ECHO.
ECHO [1] Starting Development Server (Background)...
start "React Server" /MIN cmd /c "npm run dev"

ECHO.
ECHO [2] Preparing World Access Tunnel...
ECHO.
ECHO Do you want to create a public link? (Y/N)
CHOICE /C YN /M "Start Tunnel?"

IF ERRORLEVEL 2 GOTO End
IF ERRORLEVEL 1 GOTO StartTunnel

:StartTunnel
CLS
ECHO ========================================================
ECHO      STARTING TUNNEL WIZARD
ECHO ========================================================
ECHO.
ECHO [Step 1] Fetching your Tunnel Password...
ECHO.
ECHO ********************************************************
ECHO *  YOUR PASSCODE IS:
Powershell -Command "& { $res = Invoke-WebRequest -Uri 'https://loca.lt/mytunnelpassword' -UseBasicParsing; Write-Host $res.Content -ForegroundColor Green }"
ECHO ********************************************************
ECHO.
ECHO [Step 2] Starting Tunnel...
ECHO.
:: Run the node script (which also tries to show it, but we double up just in case)
node tunnel-launcher.js
PAUSE
GOTO End

:End
ECHO.
ECHO Exiting...
TIMEOUT /T 3
EXIT
