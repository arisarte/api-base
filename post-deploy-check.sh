#!/bin/bash
# post-deploy-check.sh
# Script de verificação pós-deploy para API Saudeline
# Autor: Aristóteles & Copilot

API_URL="https://api.saudeline.arisarte.online"
DB_HOST="${DB_HOST:-127.0.0.1}"
DB_PORT="${DB_PORT:-3306}"
DB_USER="${DB_USER:-root}"
DB_PASSWORD="${DB_PASSWORD:-MinhaSenhaNova123}"
DB_NAME="${DB_NAME:-saudeline}"
SERVICE_NAME="saudeline_saudeline-api"

echo "=== 🚀 Iniciando checklist pós-deploy ==="

# 1️⃣ Testar endpoints principais
echo "🔍 Testando endpoints..."
curl -sk "$API_URL/health" | jq .
curl -sk "$API_URL/v1/items" | jq .
curl -sk -X POST "$API_URL/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@teste.com","password":"123456"}' | jq .

# 2️⃣ Validar conexão com o banco
echo "🗄️ Testando conexão com o banco..."
if command -v mysql >/dev/null 2>&1; then
  mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" -e "SELECT 1;" "$DB_NAME"
else
  echo "⚠️ Cliente MySQL não instalado no host. Pulando teste de DB."
fi

# 3️⃣ Checar logs recentes do serviço no Swarm
echo "📜 Logs recentes do serviço..."
docker service logs --tail 20 "$SERVICE_NAME"

# 4️⃣ Teste de carga leve (10 conexões simultâneas, 100 requisições)
if command -v ab >/dev/null 2>&1; then
  echo "📈 Teste de carga leve..."
  ab -n 100 -c 10 "$API_URL/health"
else
  echo "⚠️ ApacheBench (ab) não instalado. Pulando teste de carga."
fi

echo "✅ Checklist concluído."
