@echo off
echo 🚀 Iniciando Sistema SAAE...
echo.

echo 📦 Iniciando Backend...
start cmd /k "cd backend && node server.js"

timeout /t 2 /nobreak >nul

echo 🎨 Iniciando Frontend...
start cmd /k "ionic serve"

echo.
echo ✅ Sistema iniciado!
echo 🔗 Frontend: http://localhost:8100
echo 🔗 Backend: http://localhost:3000
echo.
echo ⚠️  Feche as janelas do terminal para parar os serviços.