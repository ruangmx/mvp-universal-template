---
trigger: glob
globs: "apps/api/{prisma/**,prisma.config.ts,src/common/prisma/**}"
description: Regras de banco de dados PostgreSQL e Prisma ORM (Schema, Migrations, Driver Adapter e Seeds).
---

# 04 · Banco de Dados (`PostgreSQL` + `Prisma ORM`)

## 1. Modelagem de Entidades (`apps/api/prisma/schema.prisma`)
- Toda entidade segue a convenção padrão do template:
  - Chave primária `id` em UUID (`@id @default(uuid()) @db.Uuid`).
  - Colunas de auditoria `createdAt`/`updatedAt` em UTC (`@db.Timestamptz`, `@updatedAt` cuida de `updatedAt` automaticamente).
  - **Soft delete:** `deletedAt DateTime? @map("deleted_at")`. Nenhum registro é removido fisicamente por padrão — todo `delete()` de repository marca `deletedAt`, e todo `findMany`/`findFirst` filtra `deletedAt: null` explicitamente.
- Nomeie colunas no banco em `snake_case` via `@map(...)` e propriedades em TypeScript em `camelCase`.
- Crie **índices explícitos** (`@@index([...])`) para colunas usadas em filtros frequentes (`status`, `createdAt`, `deletedAt`, chaves estrangeiras).

## 2. Driver Adapter e Cliente
- O `PrismaService` (`apps/api/src/common/prisma/prisma.service.ts`) é a **única** forma de acessar o banco — nunca instancie `PrismaClient` fora dele (exceto em `prisma/seed.ts`, que roda fora do contexto do Nest).
- O Postgres é acessado via driver adapter (`@prisma/adapter-pg` + `pg.Pool`), não via engine binária — mantém o template leve e compatível com ambientes serverless/Edge no futuro.
- Após qualquer alteração em `schema.prisma`, rode `pnpm --filter @mvp/api db:generate` (ou `prisma generate`, via `postinstall`) antes de usar os tipos novos.

## 3. Migrations e Evolução de Schema
- **Proibido** editar manualmente arquivos SQL dentro de `apps/api/prisma/migrations/` sem necessidade extrema documentada.
- O fluxo correto após alterar `schema.prisma` é:
  1. Rodar `pnpm db:generate` (`prisma migrate dev --create-only`) para gerar a migration SQL sem aplicar.
  2. Revisar o SQL gerado.
  3. Rodar `pnpm db:migrate` (`prisma migrate deploy`) para aplicar no banco.

## 4. Queries e Transações
- Evite o problema de **N+1 queries**: nunca execute queries dentro de loops. Use `include`/`select` para carregar relações de uma vez, ou `findMany` com `where: { id: { in: [...] } }`.
- Operações que alteram mais de uma tabela (ou gravam registro + histórico de auditoria) devem rodar dentro de `prisma.$transaction(async (tx) => { ... })`.

## 5. Seeds Idempotentes (`apps/api/prisma/seed.ts`)
- O comando `pnpm db:seed` (`prisma db seed`) deve ser **idempotente**: use `prisma.<model>.upsert(...)` com uma chave estável (`id` fixo ou campo `@unique`) — nunca `create` puro em loop.
