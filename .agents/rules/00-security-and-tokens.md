---
trigger: always_on
description: Regras essenciais de segurança, proteção de credenciais e economia de tokens.
---

# 00 · Segurança e Economia de Tokens

## 1. Proteção de Segredos e Credenciais
- **Nunca** leia, imprima, copie ou faça commit de `.env`, `.env.local`, `.env.production`, `*.pem`, `*.key` ou `credentials.json`.
- Apenas arquivos `.env.example` (com valores fictícios/placeholders) podem ser lidos e versionados no Git.
- Variáveis com prefixo `NEXT_PUBLIC_` no frontend vão para o navegador: **jamais** coloque chaves privadas, strings de conexão de banco ou segredos JWT nelas.

## 2. Economia de Contexto (Token Budget)
- **Leitura Cirúrgica:** Prefira buscar símbolos ou linhas específicas (`grep_search` / `Grep`) antes de ler arquivos inteiros. Em arquivos grandes (>300 linhas), leia por faixas de linhas (`StartLine`/`EndLine` ou `offset`/`limit`).
- **Delegação:** Pesquisas amplas no código ou auditorias completas devem ser delegadas aos subagentes (`codebase-explorer`, `security-auditor`, `db-architect`, `qa-tester`).
- **Anti-Loop:** Após 2 falhas consecutivas no mesmo teste ou comando de build, pare e diagnostique com o usuário.

