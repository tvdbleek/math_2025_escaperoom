@echo off
title Stopping Math Server...
color 0c
echo ==================================================
echo      STOPPING SERVER AND BACKGROUND TASKS
echo ==================================================
echo.

echo [1/3] Killing Node.js processes...
taskkill /F /IM node.exe >nul 2>&1

echo [2/3] Closing Background Server Window...
taskkill /F /FI "WINDOWTITLE eq Math Game Server (Background)" >nul 2>&1

echo [3/3] Closing Tunner Launcher...
taskkill /F /FI "WINDOWTITLE eq Math Global Launcher" >nul 2>&1

echo.
echo ==================================================
echo      SERVER SHUTDOWN COMPLETE
echo ==================================================
timeout /t 3
