# Checklist Pós-Clone, Limites do MVP e Suporte (`SUPORTE.md`)

---

## 1. Checklist Pós-Clone (Seus primeiros 10 minutos num novo MVP)

Ao criar um novo repositório no GitHub a partir deste template:

- [ ] **1. Configurar variáveis de ambiente:**
  Copie `.env.example` para `.env` e `apps/api/.env`. Gere um novo `JWT_SECRET` forte e aponte `DATABASE_URL` para seu banco local (`docker compose up -d postgres`) ou gratuito na nuvem (Neon / Supabase).
- [ ] **2. Instalar e validar a base:**
  Rode `pnpm install`, `pnpm db:migrate`, `pnpm db:seed` e depois `pnpm typecheck && pnpm lint && pnpm test && pnpm build` (ou peça ao agente `/verificar`, que roda a mesma bateria).
- [ ] **3. Renomear o projeto:**
  Peça ao agente `/renomear-projeto` informando o nome da sua marca e o slug técnico (ex.: `meu-saas`).
- [ ] **4. Remover o exemplo de Tarefas (quando estiver pronto):**
  Peça ao agente `/remover-exemplo` para limpar o módulo `tasks` de todas as camadas antes de criar sua primeira entidade real com `/nova-feature`.
- [ ] **5. Configurar proteção no GitHub:**
  Em *Settings → Branches*, adicione uma regra para `main` exigindo Pull Request e aprovação da pipeline `CI` antes do merge.

---

## 2. O que já vem pronto vs. O que configurar antes de Produção Real

| Recurso | Como funciona em Desenvolvimento (MVP) | O que fazer antes de ir para Produção Pública |
| :--- | :--- | :--- |
| **Identidade e Papéis (`IdentityGuard`)** | Se não houver headers de proxy autenticado, injeta um usuário mock `admin` para agilizar o desenvolvimento das telas. | Substitua o fallback mock em `apps/api/src/common/guards/identity.guard.ts` pela validação real de JWT / provedor de Auth (Auth.js, Clerk, Supabase Auth ou Reverse Proxy). |
| **Idempotência (`IdempotencyInterceptor`)** | Cache em memória no processo da API (evita clique duplo em dev/instância única). | Se escalar horizontalmente para múltiplas instâncias da API, troque o `Map` em memória por Redis. |
| **Eventos em Tempo Real (`EventsModule` SSE)** | Barramento RxJS em memória para atualizar telas conectadas instantaneamente. | Para múltiplas réplicas de servidor, conecte o `EventsService` ao Redis Pub/Sub ou Postgres `LISTEN/NOTIFY`. |

---

## 3. Problemas Comuns e Soluções Rápidas

### A API reclama que não encontrou `@mvp/shared` ou um novo campo do Zod
- Rode `pnpm --filter @mvp/shared build` (ou mantenha `pnpm dev` rodando, que já deixa o `shared` em modo watch).

### Erro `P1001: Can't reach database server` no Prisma
- Se estiver usando banco local, confira se o Docker está aberto e rode `docker compose up -d postgres`.
- Se estiver usando Neon/Supabase, confira se a `DATABASE_URL` em `apps/api/.env` possui `?sslmode=require`.

### O commit foi recusado pelo hook `protect-branches`
- Você está tentando commitar direto na `main` ou `develop`. Crie uma branch de trabalho:
  ```bash
  git checkout -b feature/minha-mudanca
  ```

---

## 4. Contato do Mantenedor / Suporte Técnico

- **Responsável Técnico:** *(Preencha seu nome / GitHub / e-mail ao iniciar um projeto de equipe)*
- **Canal de Suporte:** Abra uma *Issue* no repositório anexando a saída do comando `pnpm typecheck && pnpm test`.

