@echo off
title IEIS.IO Reading Platform
cd /d "%~dp0"
where python >nul 2>nul
if %errorlevel%==0 (
  echo Starting IEIS.IO at http://localhost:8000
  start "" http://localhost:8000
  python -m http.server 8000
  pause
  exit /b
)
echo Python was not found. Opening the self-contained index.html instead...
start "" "%~dp0index.html"
pause
