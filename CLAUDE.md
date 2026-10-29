# CLAUDE.md — Guia de Operação para o Claude Code

@AGENTS.md

---

## Particularidades do Ambiente Claude Code

1. **Fonte Única da Verdade:**
   - As regras globais estão em `AGENTS.md` (importado acima).
   - As regras específicas por camada estão em `.agents/rules/*.md`. Sempre leia a regra correspondente antes de editar arquivos em `packages/shared/`, `apps/api/` ou `apps/web/`.
2. **Skills (`/comando`):**
   - `.claude/skills` é um symlink direto para `.agents/skills`. Qualquer melhoria em uma skill deve ser feita em `.agents/skills/<nome>/SKILL.md`.
3. **Subagentes:**
   - Os subagentes em `.claude/agents/*.md` são gerados a partir de `.agents/agents/*.md`. Se editar um subagente em `.agents/agents/`, rode `node scripts/sync-agents.mjs` (ou `pnpm agents:sync`).
4. **Hooks de Segurança:**
   - Configurados em `.claude/settings.json` apontando para `scripts/hooks/*.sh`.

