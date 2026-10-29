---
name: git-fluxo
description: Gerencia o ciclo completo de trabalho com branches no Git (Git-Flow simplificado). Criar branch de feature a partir de develop, sincronizar novidades, preparar PR ou finalizar merge seguro. Use quando o usuario pedir para iniciar uma tarefa em branch nova, atualizar com develop ou finalizar feature.
---

# Skill: /git-fluxo — Fluxo de Branches (Git-Flow Simplificado)

Esta skill orienta o ciclo de desenvolvimento seguro: todo trabalho é isolado em branches `feature/<nome>` ou `fix/<nome>` a partir de `develop`, nunca diretamente na `main`.

---

## O Ciclo de Desenvolvimento

```text
develop ─────────●──────────────────●─────── (Ambiente integrado de dev)
                  \                / (Merge seguro após aprovação)
                   ●── feature/xyz ─●
```

---

## Passos Operacionais

### 1. Iniciar Nova Mudança
Antes de começar a codificar qualquer funcionalidade:
```bash
git checkout develop
git pull origin develop 2>/dev/null || true
git checkout -b feature/<nome-da-feature>
```
*(Para correção de bugs urgentes, use `fix/<nome-do-bug>`).*

### 2. Durante o Desenvolvimento
- Faça commits pequenos e atômicos seguindo a skill `/git-commit`.
- Mantenha o trabalho focado exclusivamente no objetivo da branch.

### 3. Conclusão e Entrega da Feature
Quando o código estiver pronto:
1. Rode a verificação completa:
   ```bash
   pnpm typecheck && pnpm lint && pnpm test
   ```
2. Traga as últimas novidades da `develop`:
   ```bash
   git fetch origin develop 2>/dev/null || true
   git merge develop
   ```
3. Se houver conflitos, explique ao usuário detalhadamente quais arquivos conflitaram e proponha a resolução mantendo as duas intenções.
4. Pergunte explicitamente ao usuário: **"O resultado está exatamente como você esperava? Posso mesclar na branch develop?"**
5. Apenas com o **OK explícito** do usuário, volte para `develop` e faça o merge sem fast-forward:
   ```bash
   git checkout develop
   git merge --no-ff feature/<nome-da-feature> -m "[chore](merge): Mescla feature/<nome-da-feature> na develop"
   ```

