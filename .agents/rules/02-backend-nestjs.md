---
trigger: glob
globs:
  - "apps/api/**"
description: Regras de arquitetura Backend para apps/api (NestJS 11, Camadas, Guards, Erros e SSE).
---

# 02 · Arquitetura Backend (`@mvp/api` — NestJS 11)

## 1. Separação Estrita de Responsabilidades (Por Módulo em `src/modules/<feature>/`)
Cada módulo de funcionalidade deve respeitar o fluxo unidirecional:
1. **`<feature>.controller.ts` (Camada HTTP):**
   - Recebe a requisição, valida parâmetros/body usando os Schemas Zod de `@mvp/shared`, chama o `Service` e devolve a resposta tipada.
   - **Proibido** conter `if/else` de regra de negócio ou chamadas diretas ao `PrismaService`.
2. **`<feature>.service.ts` (Orquestração & Caso de Uso):**
   - Orquestra regras de domínio puras (importadas de `@mvp/shared`), chama o `Repository`, dispara eventos SSE (`EventsService`) quando aplicável e gerencia transações.
3. **`<feature>.repository.ts` (Acesso a Dados):**
   - Único lugar autorizado a injetar `PrismaService` e chamar os métodos do Prisma Client (`findMany`, `create`, `update`, `$transaction`, etc.).

## 2. Tratamento de Erros e Respostas
- Nunca retorne erros crus do banco de dados para o cliente.
- Lance instâncias de `DomainError` (de `@mvp/shared`) ou `HttpException` padronizadas; o `GlobalExceptionFilter` converte tudo para o envelope `{ code, message, details?, timestamp }`.

## 3. Segurança, Idempotência e Performance
- **Variáveis de Ambiente:** Nunca use `process.env.X` solto nos módulos; injete a configuração validada por Zod (`EnvService` / `env.schema.ts`).
- **Rotas de Escrita Críticas (`POST`/`PATCH`):** Use o suporte a `Idempotency-Key` para evitar duplicações por duplo clique ou retry de rede.
- **Health Check:** O endpoint `GET /api/health` não deve executar queries no PostgreSQL para não impedir o *scale-to-zero* de bancos serverless (Neon/Supabase).

