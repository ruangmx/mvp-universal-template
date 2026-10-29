# Guia de Arquitetura e Convenções (`CONTRIBUTING.md`)

Este documento define as convenções técnicas que mantêm todo MVP nascido deste template limpo, testável e previsível — tanto para pessoas quanto para agentes de IA.

---

## 1. Fluxo Unidirecional de Uma Funcionalidade

Toda feature nova segue sempre a mesma ordem (automatizada pela skill `/nova-feature`):

1. **`packages/shared` (`@mvp/shared`)**:
   - Defina os schemas Zod (`Create<Entidade>Schema`, `Update<Entidade>Schema`, `<Entidade>Schema`) em `src/schemas/`.
   - Exporte os tipos inferidos com `z.infer`.
   - Regras de negócio puras (cálculos, transições de status com `canTransition`) moram em `src/domain/` com testes unitários `*.spec.ts`.
   - **Proibido** importar código de NestJS, Next.js, React ou Prisma dentro de `packages/shared`.

2. **`apps/api/prisma` (Banco de Dados PostgreSQL)**:
   - Modele a tabela em `apps/api/prisma/schema.prisma` com `id` UUID, `createdAt`/`updatedAt` (`@db.Timestamptz`) e `@@map("nome_snake_case")`.
   - Adicione índices (`@@index`) para colunas de filtro e chaves estrangeiras.
   - Gere e aplique a migration (`pnpm db:generate` → revisar SQL → `pnpm db:migrate`).
   - Adicione dados iniciais idempotentes (`upsert`) em `apps/api/prisma/seed.ts`.

3. **`apps/api` (Backend NestJS 11)**:
   - Crie o módulo em `apps/api/src/modules/<feature>/` respeitando as 3 camadas:
     - **`Controller`**: Apenas transporte HTTP, validação de entrada com schemas de `@mvp/shared` e guards (`@UseGuards(IdentityGuard)`). Zero regra de negócio ou Prisma aqui.
     - **`Service`**: Orquestra regras de domínio de `@mvp/shared`, chama o `Repository` e publica eventos SSE (`EventsService`) quando necessário.
     - **`Repository`**: Único arquivo do módulo autorizado a chamar `PrismaService`.

4. **`apps/web` (Frontend Next.js 15)**:
   - Cliente de API tipado em `src/lib/api/<feature>.api.ts`.
   - Estado, busca, filtros e mutações isolados num custom hook **ViewModel** em `src/hooks/use-<feature>-vm.ts`.
   - Páginas (`src/app/<feature>/page.tsx`) fazem apenas composição visual e **devem** cobrir os 4 estados: `loading`, `empty`, `error` e `success`.

---

## 2. Envelope Padrão de Erros e Paginação

- **Paginação:** Toda listagem usa `PaginationQuerySchema` na entrada e devolve `PaginatedResponse<T>` (`{ items, total, page, limit, totalPages }`).
- **Erros HTTP:** O `GlobalExceptionFilter` padroniza qualquer `DomainError`, `ZodError` ou `HttpException` no formato:
  ```json
  {
    "code": "UNPROCESSABLE_ENTITY",
    "message": "Mensagem clara sobre o problema",
    "details": {},
    "timestamp": "2026-10-29T00:00:00.000Z"
  }
  ```

---

## 3. Padrão de Branches e Commits

### Branches (Git-Flow Simplificado)
- `main`: Código estável de produção (protegida).
- `develop`: Integração contínua das funcionalidades prontas (protegida contra commit direto).
- `feature/<nome>` ou `fix/<nome>`: Onde todo o trabalho acontece.

### Mensagens de Commit
Formato semântico em português:
```text
[tipo](escopo): Mensagem objetiva no presente
```
- **Tipos válidos:** `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `ci`.
- **Exemplos:**
  - `[feat](tasks): Adiciona filtro por prioridade na listagem`
  - `[fix](api): Corrige cálculo de totalPages quando lista está vazia`
  - `[docs](readme): Atualiza instruções de configuração do Neon`

---

## 4. Critério de Pronto (Definition of Done)

Nenhuma alteração deve ser mesclada em `develop` sem passar com código de saída `0` nos quatro comandos abaixo:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

---

## 5. Evoluindo Agentes, Skills e Hooks

- **Skills:** Edite sempre em `.agents/skills/<nome>/SKILL.md` (`.claude/skills` é um symlink automático).
- **Subagentes:** Edite sempre em `.agents/agents/<nome>.md` e rode `pnpm agents:sync` para atualizar `.claude/agents/`.
- **Hooks:** A lógica compartilhada entre Antigravity e Claude Code vive em `scripts/hooks/dual-adapter.mjs` (Node.js puro, sem dependências externas).

