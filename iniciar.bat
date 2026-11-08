@echo off
chcp 65001 >nul
title EducaHub - servidor local
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Instale o Node.js 22 ou mais recente e tente novamente.
  pause
  exit /b 1
)
echo Abra http://localhost:4321 no navegador. Ctrl+C para encerrar.
node tools/server.mjs
pause
