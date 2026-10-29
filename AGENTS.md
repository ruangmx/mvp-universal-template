# AGENTS.md — Memória Principal do Repositório (Universal Agentic MVP Template)

> **Regra de Ouro de Contexto:** Este arquivo é carregado em todas as sessões. Mantenha-o enxuto (<120 linhas). Regras específicas de camada vivem em `.agents/rules/*.md` e procedimentos passo a passo vivem em `.agents/skills/*/SKILL.md`.

---

## 1. Visão Geral da Arquitetura (Monorepo `pnpm`)

Este projeto é um **Template Universal de MVP** em TypeScript estrito, dividido em 3 pacotes:

| Pacote | Caminho | Papel Arquitetural |
| :--- | :--- | :--- |
| **`@mvp/shared`** | `packages/shared/` | **Contrato Único:** Schemas Zod, DTOs, erros padronizados e regras de domínio puras (consumido via source `.ts` direto). |
| **`@mvp/api`** | `apps/api/` | **Backend:** NestJS 11 + Drizzle ORM (PostgreSQL) + Swagger + Eventos SSE + Guards. |
| **`@mvp/web`** | `apps/web/` | **Frontend:** Next.js (App Router) + Tailwind CSS v4 + View-Model Hooks + cliente HTTP tipado. |

---

## 2. Roteamento Obrigatório de Regras (Progressive Disclosure)

**ANTES de criar ou editar arquivos** em qualquer uma das pastas abaixo, você **DEVE** ler o arquivo de regra correspondente (caso ainda não esteja no seu contexto atual):

- Mexendo em `packages/shared/**` 👉 Leia `.agents/rules/01-shared-contracts.md`
- Mexendo em `apps/api/**` (exceto banco) 👉 Leia `.agents/rules/02-backend-nestjs.md`
- Mexendo em `apps/web/**` 👉 Leia `.agents/rules/03-frontend-nextjs.md`
- Mexendo em `apps/api/src/db/**` ou migrations 👉 Leia `.agents/rules/04-database-drizzle.md`
- Regras globais de segurança e tokens 👉 `.agents/rules/00-security-and-tokens.md`

---

## 3. Comandos Oficiais (Sempre rodar da raiz do repositório)

```bash
pnpm install             # Instala dependências de todos os workspaces
pnpm dev                 # Sobe API (:3333) e Web (:3000) em paralelo
pnpm test                # Roda todos os testes (Vitest) no monorepo
pnpm test:e2e            # Roda testes de integração/E2E
pnpm typecheck           # Checagem estrita de tipos TypeScript em todos os pacotes
pnpm lint                # ESLint em todos os pacotes (--max-warnings=0)
pnpm build               # Build de produção (shared, api e web)
pnpm db:generate         # Gera migration SQL do Drizzle a partir do schema
pnpm db:migrate          # Aplica migrations no PostgreSQL
pnpm db:seed             # Popula dados de teste idempotentes
pnpm db:reset            # Recria banco de dev do zero e aplica seed
pnpm agents:sync         # Sincroniza subagentes de .agents/agents para .claude/agents
```

---

## 4. Delegação para Subagentes e Orçamento Anti-Loop

1. **Isolamento de Contexto:** Se precisar explorar mais de 5 arquivos para entender uma feature, auditar segurança ou investigar um bug, **delegue a um subagente** (`codebase-explorer`, `security-auditor`, `db-architect`, `qa-tester`) para não poluir a conversa principal.
2. **Circuit Breaker (Anti-Loop):** Se um teste, build ou subagente falhar **2 vezes seguidas** com o mesmo erro, **PARE IMEDIATAMENTE** e reporte a causa raiz ao usuário. Nunca faça tentativas cegas em loop.
3. **Critério de Pronto Verificável:** Nenhuma tarefa de código está pronta até que `pnpm typecheck`, `pnpm lint` e `pnpm test` passem sem erros.

---

## 5. Restrições Inegociáveis (Guardrails)

- **PROIBIDO** usar `any` explícito ou implícito, `@ts-ignore` ou desligar regras de lint sem justificativa documentada.
- **PROIBIDO** ler, exibir ou commitar arquivos `.env`, `.env.*` (exceto `.env.example`), chaves `.pem`/`.key` ou segredos.
- **PROIBIDO** fazer commit ou push direto nas branches `main` ou `develop` (trabalhe sempre em `feature/<nome>` ou `fix/<nome>`).
- **PROIBIDO** colocar chamadas de banco de dados no Controller da API ou chamadas `fetch`/regras de negócio direto dentro do JSX no Frontend.

