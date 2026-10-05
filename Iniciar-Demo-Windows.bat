@echo off
cd /d "%~dp0"
start "Servidor Dom Juan" cmd /k python -m http.server 8000
timeout /t 2 /nobreak >nul
start "" http://localhost:8000/index.html
timeout /t 1 /nobreak >nul
start "" http://localhost:8000/pdv.html
