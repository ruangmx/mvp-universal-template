---
name: git-commit
description: Realiza commits no Git seguindo a convencao de Commits Semanticos em portugues, com verificacao de branches protegidas e checagem de segredos. Use quando o usuario pedir para salvar o trabalho, commitar alteracoes ou criar um commit.
---

# Skill: /git-commit — Commit Semântico Seguro

Esta skill valida as alterações e cria commits padronizados no Git respeitando as políticas de segurança do projeto.

---

## 1. Regras de Segurança Antes do Commit
1. **Branch Segura:** Verifique a branch atual (`git branch --show-current`).
   - Se for `main` ou `develop`, **não commite diretamente** (o hook `protect-branches.sh` bloqueará). Oriente o usuário a mudar para uma branch de trabalho (`feature/<nome>` ou `fix/<nome>`).
2. **Verificação de Segredos:** Garanta que nenhum arquivo `.env`, `.pem` ou segredo esteja staged (`git status`).
3. **Verificação de Código:** O código deve passar em `pnpm typecheck` antes do commit.

---

## 2. Padrão de Mensagem de Commit
O formato obrigatório é:
```text
[tipo](escopo): Mensagem descritiva em português
```

### Tipos Permitidos:
- `feat`: Nova funcionalidade para o usuário.
- `fix`: Correção de bug.
- `refactor`: Refatoração interna sem alteração de comportamento.
- `docs`: Documentação (README, rules, skills, etc.).
- `test`: Adição ou ajuste de testes.
- `chore`: Tarefas de manutenção, dependências ou scripts.

### Exemplos Válidos:
- `[feat](tasks): Adiciona filtro por status e paginação na listagem`
- `[fix](api): Corrige timezone UTC na criação de registros`
- `[docs](skills): Documenta nova skill de verificação`
- `[chore](deps): Atualiza dependências do monorepo`

---

## 3. Passo a Passo de Execução
1. Verifique os arquivos modificados:
   ```bash
   git status
   ```
2. Adicione apenas os arquivos relacionados à mudança:
   ```bash
   git add <arquivos>
   ```
3. Execute o commit com a mensagem padronizada:
   ```bash
   git commit -m "[tipo](escopo): Mensagem clara"
   ```
4. Apresente o hash e a mensagem final ao usuário.

