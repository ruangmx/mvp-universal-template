import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from '@prisma/client';

const INITIAL_TASKS = [
  {
    id: 'a0000000-0000-0000-0000-000000000001',
    title: 'Configurar ambiente de desenvolvimento',
    description: 'Verificar variáveis de ambiente, PostgreSQL e dependências do monorepo.',
    status: 'COMPLETED',
    priority: 'HIGH',
  },
  {
    id: 'a0000000-0000-0000-0000-000000000002',
    title: 'Modelar primeira entidade do MVP real',
    description: 'Substituir a feature de tarefas pelo primeiro caso de uso do seu novo produto.',
    status: 'IN_PROGRESS',
    priority: 'URGENT',
  },
  {
    id: 'a0000000-0000-0000-0000-000000000003',
    title: 'Validar com usuários reais',
    description: 'Apresentar o protótipo funcional para receber feedbacks de validação.',
    status: 'PENDING',
    priority: 'MEDIUM',
  },
];

async function main() {
  const pool = new Pool({
    connectionString:
      process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/mvp_dev',
  });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  console.log('[seed] Populando dados de teste idempotentes no banco...');
  try {
    for (const task of INITIAL_TASKS) {
      await prisma.task.upsert({
        where: { id: task.id },
        create: task,
        update: {},
      });
    }
    console.log(`[seed] ✅ ${INITIAL_TASKS.length} tarefas de exemplo verificadas/populadas.`);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((error) => {
  console.error('[seed] ❌ Erro ao popular seed:', error);
  process.exit(1);
});
