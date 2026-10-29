---
name: nova-feature
description: Guia de implementacao de uma funcionalidade completa ponta a ponta no monorepo seguindo o fluxo de contrato unico. Use quando o usuario pedir para criar uma nova tela, recurso, modulo, entidade ou fluxo completo de sistema.
---

# Skill: /nova-feature — Construção Ponta a Ponta

Esta skill guia o agente na criação de uma funcionalidade completa no monorepo, respeitando a separação estrita de camadas e o fluxo unidirecional: **Shared (Zod) -> Banco (Prisma) -> API (NestJS) -> Web (Next.js) -> Testes**.

---

## Fluxo Obrigatório em 5 Etapas

### Etapa 1: Contrato Único (`packages/shared/`)
*Leia antes: `.agents/rules/01-shared-contracts.md`*
1. Crie o schema Zod e DTOs em `packages/shared/src/schemas/<feature>.schema.ts`:
   - Schema de criação (`Create<Feature>Schema`)
   - Schema de atualização (`Update<Feature>Schema`)
   - Schema de resposta/entidade (`<Feature>Schema`)
   - Exporte os tipos TypeScript inferidos via `z.infer`.
2. Se houver regras de negócio puras ou transições de status, crie em `packages/shared/src/domain/<feature>.domain.ts` com testes unitários em `domain/<feature>.domain.spec.ts`.
3. Exporte tudo no `packages/shared/src/index.ts`.

### Etapa 2: Banco de Dados PostgreSQL (`apps/api/prisma/`)
*Leia antes: `.agents/rules/04-database-prisma.md`*
1. Defina o `model` em `apps/api/prisma/schema.prisma`:
   - UUID PK, timestamps UTC (`createdAt`, `updatedAt`), `deletedAt` para soft delete, índices explícitos.
2. Gere e aplique a migration:
   ```bash
   pnpm db:generate
   pnpm db:migrate
   ```
3. Adicione dados de teste idempotentes no seed em `apps/api/prisma/seed.ts` (via `upsert`).

### Etapa 3: Backend NestJS (`apps/api/src/modules/<feature>/`)
*Leia antes: `.agents/rules/02-backend-nestjs.md`*
Crie o módulo modular:
1. `<feature>.repository.ts`: Apenas queries via `PrismaService` (injetado por DI).
2. `<feature>.service.ts`: Orquestra chamadas ao repository, regras de domínio e disparos de eventos SSE (quando aplicável).
3. `<feature>.controller.ts`: Valida parâmetros/body com os schemas de `@mvp/shared` e retorna dados formatados.
4. `<feature>.module.ts`: Declara controllers e providers e registra no `AppModule`.
5. Crie testes unitários para o service e repository (`*.spec.ts`).

### Etapa 4: Frontend Next.js (`apps/web/`)
*Leia antes: `.agents/rules/03-frontend-nextjs.md`*
1. Crie o cliente HTTP tipado em `apps/web/src/lib/api/<feature>.api.ts` consumindo `@mvp/shared`.
2. Crie o hook ViewModel em `apps/web/src/hooks/use-<feature>-vm.ts` gerenciando estado, filtros, paginação e loading/error.
3. Crie a página e componentes em `apps/web/src/app/<feature>/page.tsx` respeitando os 4 estados visuais:
   - **Loading**, **Empty**, **Error** e **Success**.

### Etapa 5: Validação da Máquina
Nunca entregue sem rodar a verificação completa:
```bash
pnpm typecheck
pnpm lint
pnpm test
```
Apresente o resultado ao usuário com instruções claras de como testar a nova tela e rota.

