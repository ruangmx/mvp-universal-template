# GEMINI.md — Guia de Operação para o Google Antigravity

@AGENTS.md

---

## Particularidades do Ambiente Google Antigravity (`agy`)

1. **Customizações Nativas (`.agents/`):**
   - **Rules:** `.agents/rules/*.md` (ativadas por `Glob` ou `Always On`).
   - **Skills:** `.agents/skills/*/SKILL.md` (carregadas sob demanda via Progressive Disclosure).
   - **Subagentes:** `.agents/agents/*.md` (sempre que editar um subagente aqui, rode `node scripts/sync-agents.mjs` para manter `.claude/agents/` sincronizado).
   - **Hooks:** `.agents/hooks.json` executa os mesmos guardrails em `scripts/hooks/*.sh`.
2. **Revisão via Artifacts e Diff:**
   - Para mudanças arquiteturais que toquem em mais de 2 arquivos, proponha o plano antes de executar.

