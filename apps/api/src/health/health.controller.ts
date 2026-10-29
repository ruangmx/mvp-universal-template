import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  /**
   * Health check ultraleve: NÃO executa queries no PostgreSQL
   * para não impedir o scale-to-zero ou consumir horas de compute
   * de bancos serverless (Neon / Supabase) desnecessariamente.
   */
  @Get()
  check() {
    return {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }
}

