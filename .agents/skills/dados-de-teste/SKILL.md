---
name: dados-de-teste
description: Criacao, atualizacao e populacao de dados de teste (seeds) realistas e idempotentes no banco PostgreSQL. Use quando o usuario pedir para gerar dados fake, popular o banco, criar cenarios de teste ou ajustar seeds.
---

# Skill: /dados-de-teste — Seeds Idempotentes

Esta skill padroniza a geração de dados de teste no PostgreSQL para validar cenários reais de ponta a ponta sem duplicar registros a cada execução.

---

## Regras de Ouro para Seeds
1. **Idempotência Obrigatória:** O script `pnpm db:seed` deve poder rodar 10 vezes seguidas sem estourar erro de chave única nem duplicar registros. Use sempre `prisma.<model>.upsert(...)` com uma chave estável.
2. **IDs Fixos e Determinísticos:** Para entidades base de teste (ex.: usuário admin fixo, categorias padrão, tarefas de exemplo), use UUIDs determinísticos/conhecidos para que os testes de integração possam depender desses dados.
3. **Cenários Ricos:** Crie dados em diferentes estados (ex.: itens pendentes, em andamento, concluídos e cancelados) para testar filtros e paginação da tela.

---

## Como Atualizar o Seed (`apps/api/prisma/seed.ts`)

1. Localize o arquivo central de seed em `apps/api/prisma/seed.ts`.
2. Para cada entidade, defina uma lista de registros mock tipados.
3. Execute o upsert utilizando Prisma:
   ```typescript
   await prisma.task.upsert({
     where: { id: mockTask.id },
     create: mockTask,
     update: {},
   });
   ```
4. Teste a execução duas vezes para garantir a idempotência:
   ```bash
   pnpm db:seed
   pnpm db:seed
   ```
5. Confirme ao usuário a quantidade de registros populados e como visualizá-los na aplicação (`pnpm db:studio` ou na interface web).

