#!/bin/bash
set -e

echo "→ Copiando arquivos de ambiente..."
cp -n .env.example apps/api/.env 2>/dev/null && echo "  criado apps/api/.env" || echo "  apps/api/.env já existe, mantendo"
cp -n .env.example apps/web/.env.local 2>/dev/null && echo "  criado apps/web/.env.local" || echo "  apps/web/.env.local já existe, mantendo"

echo "→ Instalando dependências..."
pnpm install

echo "→ Subindo banco de dados..."
docker compose up -d

echo "→ Aguardando Postgres ficar pronto..."
until docker exec feeagro-db pg_isready -U feeagro -q 2>/dev/null; do
  printf "."
  sleep 1
done
echo " pronto!"

echo "→ Aplicando migrations..."
pnpm --filter @feeagro/api run db:deploy

echo "→ Populando banco com dados de demonstração..."
pnpm --filter @feeagro/api run db:seed

echo ""
echo "✓ Setup concluído! Rode 'pnpm dev' para iniciar."
echo "  API:      http://localhost:3333"
echo "  Frontend: http://localhost:3000"
echo "  Login:    joao@feeagro.com / 123456"
