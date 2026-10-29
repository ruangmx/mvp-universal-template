---
name: comecar
description: Primeiro uso do template ou onboarding no projeto. Verifica requisitos de ambiente (Node.js, pnpm, Docker/Postgres), configura variaveis de ambiente (.env), instala dependencias, aplica migrations, roda seed e inicia a aplicacao. Use sempre que o usuario disser "comecar", "iniciar projeto", "como rodar" ou pedir setup inicial.
---

# Skill: /comecar — Onboarding e Setup Inicial

Esta skill prepara o ambiente do monorepo do zero até a aplicação estar rodando e explicada ao usuário.

## Passos de Execução

### 1. Verificação de Pré-requisitos
Execute e confirme as ferramentas da máquina:
```bash
node -v   # Requer Node.js >= 20.x (preferencialmente 24 LTS)
pnpm -v   # Requer pnpm >= 9.x
git --version
```
- Se o `pnpm` não estiver instalado, instrua: `npm install -g pnpm`.

### 2. Configuração de Variáveis de Ambiente
Verifique se os arquivos `.env` existem na raiz, em `apps/api/` e em `apps/web/`.
- Se não existirem, copie a partir dos respectivos `.env.example`:
```bash
cp .env.example .env 2>/dev/null || true
cp apps/api/.env.example apps/api/.env 2>/dev/null || true
cp apps/web/.env.example apps/web/.env 2>/dev/null || true
```
*(Lembrete de segurança: nunca exiba o conteúdo de arquivos `.env` no chat).*

### 3. Banco de Dados PostgreSQL (Local ou Nuvem)
Pergunte ou detecte a conexão configurada em `DATABASE_URL`:
- **Opção Local (Docker):** Suba o container do PostgreSQL:
  ```bash
  docker compose up -d postgres
  ```
- **Opção Nuvem (Neon / Supabase):** Apenas certifique-se de que a `DATABASE_URL` aponta para o banco remoto com SSL ativado.

### 4. Instalação e Preparação do Banco
Rode a sequência oficial:
```bash
pnpm install
pnpm db:migrate
pnpm db:seed
```

### 5. Verificação Rápida
Valide se os tipos e testes base estão passando:
```bash
pnpm typecheck
pnpm test
```

### 6. Subir o Sistema e Explicar ao Usuário
Informe ao usuário os comandos para rodar o ambiente:
```bash
pnpm dev
```
Apresente o resumo amigável em português:
- **Web (Next.js):** `http://localhost:3000`
- **API (NestJS):** `http://localhost:3333`
- **Documentação Swagger:** `http://localhost:3333/docs`
- **Feature Molde:** Explique que o sistema vem com uma funcionalidade de exemplo (`tasks`) pronta de ponta a ponta para servir de modelo.

