---
trigger: glob
globs:
  - "apps/web/**"
description: Regras de arquitetura Frontend para apps/web (Next.js App Router, Tailwind v4 e ViewModel Hooks).
---

# 03 · Arquitetura Frontend (`@mvp/web` — Next.js + Tailwind v4)

## 1. Padrão View-Model (Zero Regra de Negócio no JSX)
Para manter as telas fáceis de manter e testar:
1. **Rotas (`src/app/**`):** Arquivos `page.tsx` e `layout.tsx` fazem **apenas composição visual**.
2. **View-Models (`src/hooks/use-<feature>-vm.ts`):** Todo estado de tela, filtros, paginação, chamadas à API (`apiClient`) e tratamento de loading/erro vivem em um custom hook ViewModel.
3. **Componentes Visuais (`src/components/ui/` e `src/components/<feature>/`):** Recebem dados e callbacks via props tipadas. Proibido chamar `fetch` direto dentro de um botão ou componente visual.

## 2. Validação e Tipagem com `@mvp/shared`
- Formulários e chamadas HTTP devem usar **exatamente os mesmos Schemas Zod e tipos** exportados por `@mvp/shared`.
- Nunca redeclare interfaces de entidades (`Task`, `PaginatedResponse`, etc.) dentro de `apps/web`.

## 3. UI, Acessibilidade e Estados de Tela
- Toda tela ou componente que consome dados assíncronos **deve** tratar explicitamente os 4 estados:
  1. **Loading** (skeleton ou indicador claro).
  2. **Empty State** (mensagem amigável + ação quando a lista está vazia).
  3. **Error State** (mensagem compreensível em português + botão "Tentar novamente").
  4. **Success State** (dados renderizados).
- Use HTML semântico (`<main>`, `<section>`, `<nav>`, `<button type="button">`), atributos `aria-label` em botões só com ícone e contraste adequado.

