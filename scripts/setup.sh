#!/bin/bash
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
GRAY='\033[0;90m'
NC='\033[0m'

step() { echo -e "\n${GREEN}→${NC} $1"; }
fail() { echo -e "\n${RED}✗ Erro:${NC} $1"; exit 1; }

cd "$(dirname "$0")/.."

# ── Pré-requisitos ────────────────────────────────────────────────────────────

command -v docker >/dev/null 2>&1 || fail "Docker não encontrado. Instale em https://docs.docker.com/get-docker/"
command -v node >/dev/null 2>&1   || fail "Node.js não encontrado. Instale a versão 18 ou superior."
command -v pnpm >/dev/null 2>&1   || fail "pnpm não encontrado. Rode: npm install -g pnpm"

NODE_MAJOR=$(node -e "process.stdout.write(process.version.split('.')[0].slice(1))")
[ "$NODE_MAJOR" -ge 18 ] || fail "Node.js 18+ é necessário. Versão atual: $(node --version)"

# ── Env files (antes do install para o Prisma achar DATABASE_URL) ─────────────

step "Configurando arquivos de ambiente..."
cp -n .env.example apps/api/.env 2>/dev/null \
  && echo -e "  ${GRAY}criado apps/api/.env${NC}" \
  || echo -e "  ${GRAY}apps/api/.env já existe, mantendo${NC}"

cp -n .env.example apps/web/.env.local 2>/dev/null \
  && echo -e "  ${GRAY}criado apps/web/.env.local${NC}" \
  || echo -e "  ${GRAY}apps/web/.env.local já existe, mantendo${NC}"

# ── Dependências ──────────────────────────────────────────────────────────────

step "Instalando dependências..."
pnpm install || fail "pnpm install falhou."

# ── Prisma Client ─────────────────────────────────────────────────────────────

step "Gerando Prisma Client..."
pnpm --filter @feeagro/api run db:generate || fail "prisma generate falhou."

# ── Banco de dados ────────────────────────────────────────────────────────────

step "Subindo banco de dados..."
docker compose up -d || fail "Docker Compose falhou. O Docker está rodando?"

step "Aguardando Postgres ficar pronto..."
RETRIES=30
until docker exec feeagro-db pg_isready -U feeagro -q 2>/dev/null; do
  RETRIES=$((RETRIES - 1))
  [ $RETRIES -eq 0 ] && fail "Postgres não respondeu após 30 segundos. Verifique o Docker."
  printf "."
  sleep 1
done
echo -e " ${GREEN}pronto!${NC}"

# ── Migrations + Seed ─────────────────────────────────────────────────────────

step "Aplicando migrations..."
pnpm --filter @feeagro/api run db:deploy || fail "prisma migrate deploy falhou."

step "Populando banco com dados de demonstração..."
pnpm --filter @feeagro/api run db:seed || fail "seed falhou."

# ── Concluído ─────────────────────────────────────────────────────────────────

echo -e "\n${GREEN}✓ Setup concluído!${NC} Rode 'pnpm dev' para iniciar.\n"
echo -e "  API:      ${GRAY}http://localhost:3333${NC}"
echo -e "  Frontend: ${GRAY}http://localhost:3000${NC}"
echo -e "  Login:    ${GRAY}joao@feeagro.com / 123456${NC}\n"
