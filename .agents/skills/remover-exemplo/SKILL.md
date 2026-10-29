---
name: remover-exemplo
description: Remove com seguranca a funcionalidade molde de exemplo (Tarefas / tasks) do monorepo (shared, schemas, banco, API e frontend) quando o usuario for construir seu MVP real. Use quando o usuario disser "remover exemplo", "limpar tarefas", "tirar tarefas" ou iniciar o dominio proprio.
---

# Skill: /remover-exemplo — Limpeza da Feature Molde

Esta skill limpa completamente a funcionalidade de exemplo (`tasks`) de todas as camadas do monorepo quando o usuário estiver pronto para implementar as entidades do seu próprio produto.

---

## Checklist Cirúrgico de Remoção

### 1. No Contrato Compartilhado (`packages/shared/`)
- Remova `packages/shared/src/schemas/tasks.schema.ts`.
- Remova `packages/shared/src/domain/tasks.domain.ts` e seu teste `tasks.domain.spec.ts`.
- Em `packages/shared/src/index.ts`, remova os exports relacionados a `tasks`.

### 2. No Banco de Dados PostgreSQL (`apps/api/prisma/`)
- Remova o `model Task` de `apps/api/prisma/schema.prisma`.
- Em `apps/api/prisma/seed.ts`, remova os dados fake de tarefas.
- Gere e aplique a migration de exclusão da tabela:
  ```bash
  pnpm db:generate
  pnpm db:migrate
  ```

### 3. No Backend NestJS (`apps/api/src/`)
- Exclua a pasta inteira `apps/api/src/modules/tasks/`.
- No `apps/api/src/app.module.ts`, remova a importação e o registro de `TasksModule`.

### 4. No Frontend Next.js (`apps/web/`)
- Exclua a rota `apps/web/src/app/tasks/`.
- Remova o hook `apps/web/src/hooks/use-tasks-vm.ts`.
- Remova o cliente da API `apps/web/src/lib/api/tasks.api.ts`.
- Na página inicial (`apps/web/src/app/page.tsx`), substitua o link de tarefas por uma tela de boas-vindas neutra convidando a criar as primeiras telas do novo MVP.

### 5. Verificação de Limpeza
Rode a bateria para garantir que nenhuma dependência órfã de `tasks` permaneceu:
```bash
pnpm typecheck
pnpm test
```
Confirme ao usuário: "Feature de exemplo de tarefas removida com sucesso! O template está limpo e pronto para o seu domínio real."

