---
name: banco-de-dados
description: Operacoes de banco de dados PostgreSQL e Prisma ORM. Criar ou alterar models, gerar migrations SQL, aplicar migrations, rodar seeds ou recriar o banco do zero. Use quando o usuario pedir alteracoes de schema, novas colunas, migracao ou reset de banco.
---

# Skill: /banco-de-dados — Gestão do PostgreSQL & Prisma

Esta skill padroniza a criação e evolução de models do PostgreSQL via Prisma ORM (driver adapter `@prisma/adapter-pg`) no monorepo.

*Antes de alterar código de banco, leia sempre `.agents/rules/04-database-prisma.md`.*

---

## Fluxos de Trabalho

### Fluxo A: Criar ou Modificar uma Entidade
1. Edite `apps/api/prisma/schema.prisma` adicionando/alterando o `model`.
   - Lembre-se: UUID para chave primária (`@id @default(uuid()) @db.Uuid`), colunas no banco em `snake_case` via `@map`, propriedades em `camelCase`, timestamps com timezone (`@db.Timestamptz`), `deletedAt` para soft delete e índices explícitos (`@@index`).
2. Gere o arquivo de migration SQL sem aplicar ainda:
   ```bash
   pnpm db:generate
   ```
3. Revise o SQL gerado dentro de `apps/api/prisma/migrations/`.
4. Aplique a migration no PostgreSQL:
   ```bash
   pnpm db:migrate
   ```
5. Regere o client com os novos tipos (acontece automaticamente no `postinstall`, ou rode `prisma generate` manualmente se necessário).

### Fluxo B: Recriar Banco do Zero (Reset de Dev)
Se o banco local de desenvolvimento estiver corrompido ou com dados divergentes:
```bash
pnpm db:reset
```
*O comando `db:reset` (`prisma migrate reset`) apaga os dados locais, reaplica todas as migrations e roda o seed idempotente.*

### Fluxo C: Visualizar Dados no Navegador (Prisma Studio)
Para inspecionar as tabelas visualmente:
```bash
pnpm db:studio
```
Abra a URL indicada pelo terminal.

### Fluxo D: Diagnóstico de Erros Comuns
- **Erro de Conexão (ECONNREFUSED):** Verifique se o container PostgreSQL está de pé (`docker compose ps`) ou se a `DATABASE_URL` no `.env` está correta.
- **Migration Divergente:** Nunca edite migrations antigas já aplicadas. Crie uma nova migration rodando `pnpm db:generate`.
- **Tipos desatualizados após alterar o schema:** Rode `prisma generate` manualmente — o client vive em `apps/api/generated/prisma` (ignorado pelo Git).
