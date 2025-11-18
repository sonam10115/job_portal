# Job Portal - Startup Script
Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     Job Portal Application - Starting Servers         ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Kill any existing Node processes
Write-Host "🛑 Stopping existing Node processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Start Backend
Write-Host "🚀 Starting Backend Server (port 8001)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit -Command cd 'e:\job portal\backend'; npm run dev" -NoNewWindow

# Wait for backend to start
Start-Sleep -Seconds 5

# Start Frontend
Write-Host "🚀 Starting Frontend Server (port 5173)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit -Command cd 'e:\job portal\frontend'; npm run dev" -NoNewWindow

# Wait for frontend to start
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "═════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✅ BOTH SERVERS STARTED!" -ForegroundColor Green
Write-Host "═════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "📱 Frontend:  http://localhost:5173" -ForegroundColor Cyan
Write-Host "🔧 Backend:   http://localhost:8001" -ForegroundColor Cyan
Write-Host "💚 Health:    http://localhost:8001/api/health" -ForegroundColor Cyan
Write-Host ""
Write-Host "⏳ Please wait 5 seconds for both servers to fully start..." -ForegroundColor Yellow
Write-Host ""

# Verify servers
Start-Sleep -Seconds 5
$backend = Test-NetConnection -ComputerName localhost -Port 8001 -WarningAction SilentlyContinue
$frontend = Test-NetConnection -ComputerName localhost -Port 5173 -WarningAction SilentlyContinue

if ($backend.TcpTestSucceeded) {
    Write-Host "✅ Backend is running on port 8001" -ForegroundColor Green
} else {
    Write-Host "❌ Backend failed to start on port 8001" -ForegroundColor Red
}

if ($frontend.TcpTestSucceeded) {
    Write-Host "✅ Frontend is running on port 5173" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend failed to start on port 5173" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎯 Now open your browser and go to: http://localhost:5173/register" -ForegroundColor Yellow
Write-Host ""
