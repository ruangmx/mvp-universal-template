---
name: verificar
description: Bateria de checagem completa de qualidade do monorepo (typecheck estrito, lint sem avisos, testes unitarios/integracao no Vitest e build de producao). Use antes de concluir qualquer tarefa, antes de commitar, antes de abrir PR ou quando o usuario pedir para conferir se esta tudo pronto.
---

# Skill: /verificar — Critério de Pronto Verificável

Esta skill roda a bateria de qualidade automatizada da máquina para garantir que o monorepo está 100% íntegro antes de qualquer entrega ou commit.

> [!IMPORTANT]
> **Regra Anti-Loop:** Se qualquer etapa falhar 2 vezes seguidas com o mesmo erro, **PARE IMEDIATAMENTE** e reporte a causa raiz ao usuário com o arquivo e linha exatos. Nunca faça tentativas cegas.

---

## Sequência de Verificação

Execute os comandos na ordem exata a partir da raiz do monorepo:

### 1. Checagem Estrita de Tipos TypeScript
```bash
pnpm typecheck
```
- Valida `@mvp/shared`, `@mvp/api` e `@mvp/web` com `strict: true`.
- Zero erros permitidos. Proibido usar `@ts-ignore` ou `any`.

### 2. Análise Estática de Código (ESLint)
```bash
pnpm lint
```
- Roda com `--max-warnings=0`. Qualquer warning é tratado como erro.

### 3. Bateria de Testes Automatizados (Vitest)
```bash
pnpm test
```
- Roda testes unitários de domínio em `@mvp/shared`, testes de serviços/controllers em `apps/api` e testes de componentes em `apps/web`.
- Todos os testes devem passar (verde).

### 4. Build de Produção
```bash
pnpm build
```
- Garante que a compilação de produção da API e a geração estática/SSR do Next.js ocorrem sem erros.

---

## Resultado da Verificação
Apresente ao usuário um relatório conciso:
- `Typecheck:` ✅ PASS
- `Lint:` ✅ PASS
- `Testes:` ✅ PASS (N testes aprovados)
- `Build:` ✅ PASS
- "O código atende a 100% dos critérios de qualidade e está pronto para commit seguro!"

