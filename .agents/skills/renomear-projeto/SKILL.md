---
name: renomear-projeto
description: Personaliza o nome, identificadores de pacotes e branding do template para o novo MVP do usuario. Use quando o usuario pedir para renomear o projeto, trocar o nome do sistema ou configurar o branding inicial do MVP.
---

# Skill: /renomear-projeto — Personalização do MVP

Esta skill ajusta o nome padrão `@mvp/*` para o nome real do produto do usuário em todo o monorepo.

## Passos de Execução

### 1. Coleta do Nome do Produto
Pergunte ao usuário (caso ele ainda não tenha informado):
1. **Nome Amigável / Marca:** (ex.: `Burguer Flow`, `DocPay`, `SaaS Admin`)
2. **Slug técnico em kebab-case:** (ex.: `burger-flow`, `doc-pay`)

### 2. Substituição Segura em Arquivos de Configuração
Atualize cirurgicamente os arquivos:
1. `package.json` (raiz): `"name": "<slug-tecnico>-monorepo"`
2. `packages/shared/package.json`: `"name": "@<slug-tecnico>/shared"`
3. `apps/api/package.json`: `"name": "@<slug-tecnico>/api"` e ajuste a dependência `"@<slug-tecnico>/shared": "workspace:*"`
4. `apps/web/package.json`: `"name": "@<slug-tecnico>/web"` e ajuste a dependência `"@<slug-tecnico>/shared": "workspace:*"`
5. `tsconfig.base.json`: Atualize os path aliases (`@<slug-tecnico>/shared`)
6. `apps/api/tsconfig.json` e `apps/web/tsconfig.json`: Atualize os path aliases correspondentes.
7. `apps/web/src/app/layout.tsx`: Atualize a tag `title` e metadados com o nome amigável do produto.
8. `README.md`: Atualize o título principal e descrição inicial.

### 3. Reinstalação de Links do Monorepo
Rode para o pnpm reconstruir a árvore de symlinks interna:
```bash
pnpm install
```

### 4. Verificação de Integridade
Garanta que nada quebrou na renomeação dos imports:
```bash
pnpm typecheck
pnpm test
```

### 5. Confirmação
Mostre ao usuário as alterações realizadas e oriente:
- "Projeto renomeado com sucesso para **<Nome Amigável>**! Agora você pode começar a modelar suas próprias tabelas ou rodar `/remover-exemplo` quando não precisar mais do molde de tarefas."

