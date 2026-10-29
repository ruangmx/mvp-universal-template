---
name: componente-ui
description: Criacao e evolucao de componentes visuais reutilizaveis em apps/web usando Next.js, Tailwind CSS v4, shadcn/ui e padroes de acessibilidade. Use quando o usuario pedir um novo botao, modal, tabela, card, formulario ou componente de tela.
---

# Skill: /componente-ui — Componentes de Interface

Esta skill orienta a criação de componentes visuais consistentes, acessíveis e desacoplados de regras de negócio em `apps/web`.

*Antes de começar, leia `.agents/rules/03-frontend-nextjs.md`.*

---

## Diretrizes de Construção

### 1. Separação: Primitivo vs. Composto
- **Primitivos (`apps/web/src/components/ui/`):** Componentes genéricos puros (Botões, Inputs, Dialogs, Badges, Cards, Dropdowns, Skeletons).
  - Devem ser reutilizáveis em qualquer parte da aplicação.
  - Aceitam `className` e propagam props HTML (`React.ComponentProps<"button">`).
- **Compostos de Domínio (`apps/web/src/components/<feature>/`):** Montam telas específicas a partir de primitivos.
  - Recebem dados prontos e callbacks via props (nunca chamam API diretamente).

### 2. Acessibilidade (a11y) Obrigatória
- Todo botão que contém apenas ícone **deve** ter `aria-label="Descrição da ação"`.
- Modais e Dialogs devem suportar fechamento com a tecla `Esc` e prender o foco.
- Inputs devem sempre possuir `<label htmlFor="...">` associado ao `id` do input.
- Garanta contraste legível entre textos e fundos no Tailwind v4.

### 3. Os 4 Estados Visuais em Listagens e Dados
Sempre que o componente renderizar dados dinâmicos:
1. **Loading:** Exiba um esqueleto visual (`<Skeleton />`) mantendo o layout estável.
2. **Empty:** Exiba ícone ilustrativo + mensagem amigável em português + botão de ação primária (ex.: "Nenhuma tarefa criada. Clique aqui para criar a primeira.").
3. **Error:** Exiba alerta com o erro amigável e botão "Tentar novamente".
4. **Success:** Renderize o conteúdo completo.

### 4. Validação
Ao finalizar a criação do componente, rode:
```bash
pnpm typecheck
pnpm lint
```

