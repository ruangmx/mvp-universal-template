---
trigger: glob
globs:
  - "packages/shared/**"
description: Regras de arquitetura para o pacote @mvp/shared (Schemas Zod, Domínio Puro e Erros).
---

# 01 · Contrato Compartilhado (`@mvp/shared`)

O pacote `packages/shared` é o **coração do contrato** entre `apps/api` (NestJS) e `apps/web` (Next.js).

- **`apps/api` e `apps/web`:** ambos consomem `@mvp/shared` compilado (`packages/shared/dist`) via resolução padrão do workspace `pnpm`. O build do `shared` roda automaticamente no `postinstall` da raiz, em paralelo no `pnpm dev` (`tsc --watch`) e antes de `typecheck`/`test`/`build`.

## 1. Dependências Permitidas
- **Zero acoplamento de framework:** `packages/shared` **NUNCA** deve importar nada de `@nestjs/*`, `next/*`, `react`, `@prisma/client` ou bibliotecas de banco/HTTP.
- A única dependência externa permitida para validação é `zod`.

## 2. Organização Interna (`packages/shared/src/`)
- `schemas/`: Schemas Zod para validação de entrada (DTOs de criação/atualização, queries de paginação) e saída (respostas da API).
  - Sempre exporte tanto o Schema (`CreateTaskSchema`) quanto o tipo inferido (`export type CreateTaskInput = z.infer<typeof CreateTaskSchema>`).
- `domain/`: Funções puras de regra de negócio e máquinas de estado (ex.: `canTransition`, cálculos, invariantes de domínio).
  - Toda função em `domain/` deve ser 100% determinística, sem efeitos colaterais (I/O) e coberta por testes unitários no Vitest (`*.spec.ts`).
- `errors/`: Códigos de erro padronizados (`AppErrorCode`), classe `DomainError` e schema do envelope de erro HTTP (`ApiErrorResponseSchema`).

## 3. Envelope HTTP e Paginação
- Toda rota paginada deve usar `PaginationQuerySchema` na entrada e `PaginatedResponse<T>` na saída.
- Nunca crie formatos de resposta avulsos fora do contrato de `@mvp/shared`.

