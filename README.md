# 🌾 FeeAgro — Agro Finance Dashboard

Mini-dashboard bancário com foco em RWA (Real World Assets) do agronegócio brasileiro. Desenvolvido como desafio técnico full-stack.

---

## Rodar localmente

### Pré-requisitos
- Node.js >= 20
- pnpm >= 9
- Docker (para o PostgreSQL)

### Setup em um comando

```bash
pnpm setup
```

Isso vai:
1. Instalar dependências
2. Subir o PostgreSQL via Docker
3. Aplicar as migrations
4. Popular o banco com dados de demonstração

### Desenvolvimento

```bash
pnpm dev   # API em :3333 e Web em :3000
```

**Acesso demo:**
- URL: [http://localhost:3000](http://localhost:3000)
- Email: `joao@feeagro.com`
- Senha: `123456`

### Comandos úteis

| Comando | Descrição |
|---------|-----------|
| `pnpm dev` | Roda API + Web em paralelo |
| `pnpm build` | Build de produção |
| `pnpm lint` | Lint geral |
| `pnpm test` | Testes |
| `pnpm db:studio` | Prisma Studio (UI do banco) |
| `pnpm db:reset` | Reset do banco + seed |

---

## Arquitetura

### Monorepo (pnpm workspaces)

```
feeAgro/
├── apps/
│   ├── api/     # Fastify backend
│   └── web/     # Next.js frontend
└── packages/
    └── shared/  # Zod schemas + tipos compartilhados
```

### Stack

| Camada | Tecnologias |
|--------|------------|
| **Backend** | Fastify + Prisma + PostgreSQL + JWT |
| **Frontend** | Next.js 14 (App Router) + Tailwind v4 + TanStack Query |
| **Shared** | Zod schemas (single source of truth para validação) |
| **Auth** | JWT (access token em memória) + refresh token httpOnly cookie |

### Endpoints da API (`/api/v1`)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/auth/register` | Cadastro |
| POST | `/auth/login` | Login |
| POST | `/auth/refresh` | Renovar token |
| GET | `/auth/me` | Usuário autenticado |
| GET | `/dashboard/summary` | Resumo completo (conta + RWA + KYC + últimas transações) |
| GET | `/transactions` | Lista paginada com filtros |
| GET | `/transactions/:id` | Detalhe de transação |
| POST | `/operations/transfer` | Simular transferência |
| POST | `/operations/investment` | Simular investimento em RWA |

---

## Decisões técnicas

**Monorepo sem Turborepo**: pnpm workspaces puros evitam overhead de configuração mantendo a organização. Para um projeto desse escopo, Turborepo seria overkill.

**`packages/shared`**: Schemas Zod são a fonte da verdade para tipos — usados tanto na validação do backend quanto nos formulários do frontend via `zodResolver`. Elimina drift entre as camadas.

**Fastify ao invés de Express**: TypeScript-first, mais rápido, sistema de plugins mais organizado. O `@fastify/jwt` torna a auth trivial com `request.jwtVerify()`.

**Auth JWT + Refresh Token**: Access token (15min) em memória evita XSS. Refresh token em `httpOnly` cookie (7 dias) persiste a sessão. Token rotation: cada refresh invalida o token anterior.

**TanStack Query**: `keepPreviousData` para paginação suave, `invalidateQueries` automático após operações, `staleTime` de 30s para o dashboard.

**Tailwind v4**: Configuração via CSS `@theme` ao invés de `tailwind.config.ts`. Cores e tokens definidos como variáveis CSS nativas.

**Design "Terra Dourada"**: Dark theme com verdes profundos (`#0c1a10` fundo, `#14261a` cards) e acentos dourados (`#e9c46a`). Fonts: Syne (display/títulos) + DM Sans (corpo). Grain texture no background para profundidade.

### Trade-offs

- **Sem cache de imagem (Sharp)**: Para reduzir complexidade de setup local.
- **Sem WebSocket para preços em tempo real**: Os preços dos tokens são estáticos no seed. Em produção, usaria SSE ou WebSocket com feed de cotação.
- **RefreshToken via body ao invés de cookie**: Simplificação para compatibilidade com o cliente Axios sem `credentials: 'include'` em todos os ambientes. Em produção, seria 100% via httpOnly cookie.

### O que melhoraria com mais tempo

- [ ] Testes E2E com Playwright (login → nova operação → ver transação)
- [ ] Preços dinâmicos dos ativos (SSE ou polling de API pública da B3/CBOT)
- [ ] Deploy: API no Railway + Web na Vercel
- [ ] Histórico de preços com gráfico sparkline no dashboard
- [ ] PWA com push notifications para status de operações
- [ ] Rate limiting nas rotas de auth
- [ ] Paginação infinita (scroll) nas transações mobile
