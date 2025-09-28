param(
  [switch]$ForceInit
)

Write-Host "🔍 Checando Docker..."
$docker = Get-Command docker -ErrorAction SilentlyContinue
if (-not $docker) {
  Write-Host "❌ Docker não encontrado. Instale o Docker Desktop antes de prosseguir: https://www.docker.com/get-started"
  exit 1
}

Write-Host "⬆️  Subindo serviços com docker compose..."
docker compose up -d --build

Write-Host "⏳ Aguardando MariaDB (127.0.0.1:3306) ficar disponível..."
$maxAttempts = 60
$attempt = 0
while ($attempt -lt $maxAttempts) {
  $res = Test-NetConnection -ComputerName 127.0.0.1 -Port 3306 -WarningAction SilentlyContinue
  if ($res -and $res.TcpTestSucceeded) {
    Write-Host "✅ MariaDB está disponível"
    break
  }
  Start-Sleep -Seconds 2
  $attempt++
  Write-Host "Aguardando MariaDB... tentativa $attempt/$maxAttempts"
}

if ($attempt -ge $maxAttempts) {
  Write-Host "❌ MariaDB não ficou disponível dentro do tempo esperado. Verifique os logs do container (docker logs api-mariadb)."
  exit 1
}

if ($ForceInit) {
  Write-Host "⚠️  Forçando re-inicialização do DB: removendo .db_initialized"
  Remove-Item -Path .\.db_initialized -ErrorAction SilentlyContinue
}

Write-Host "▶️ Iniciando a API (npm run start) — logs aparecerão abaixo"
npm run start
