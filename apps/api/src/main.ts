import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter.js';
import { validateEnv } from './common/env/env.schema.js';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const env = validateEnv();

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  });

  app.setGlobalPrefix('api');
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Swagger Documentation em /docs
  const config = new DocumentBuilder()
    .setTitle('MVP API')
    .setDescription('Documentação OpenAPI do Backend NestJS do MVP Template')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(env.PORT);
  console.log(`🚀 API rodando em http://localhost:${env.PORT}/api`);
  console.log(`📚 Documentação Swagger disponível em http://localhost:${env.PORT}/docs`);
}

bootstrap();

