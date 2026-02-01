@echo off
title Math Global Launcher
setlocale Math Escaperoom - Global Launcher
color 0a
cls
echo ==================================================
echo      MATH ESCAPEROOM - GLOBAL ACCESS LINK
echo ==================================================
echo.
echo.
echo [1/3] Hacking Mainframe (Starting Build on Core 1)...
start "Math Game Server (Background)" /MIN cmd /c "npm run build && npx serve -s dist -l tcp://0.0.0.0:5173 -n"

:TunnelLoop
echo.
echo [2/3] Establishing Satellite Uplink (Core 2-4)...
echo    (Link will appear INSTANTLY. Game might take 5s to load first time.)
node tunnel-launcher.js
echo.
echo ⚠️ Connection Lost! Re-aligning Satellite...
echo    (Press Ctrl+C to stop)
timeout /t 5
goto TunnelLoop
