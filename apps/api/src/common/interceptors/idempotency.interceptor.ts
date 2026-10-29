import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

interface CachedResponse {
  statusCode: number;
  body: unknown;
  timestamp: number;
}

const IDEMPOTENCY_CACHE = new Map<string, CachedResponse>();
const CACHE_TTL_MS = 60 * 1000; // 1 minuto de cache

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const idempotencyKey = request.headers['idempotency-key'] as string | undefined;

    // Apenas opera se o cliente enviar o header Idempotency-Key em rotas de mutação
    if (!idempotencyKey || (request.method !== 'POST' && request.method !== 'PATCH')) {
      return next.handle();
    }

    const cacheKey = `${request.method}:${request.originalUrl}:${idempotencyKey}`;
    const cached = IDEMPOTENCY_CACHE.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      response.status(cached.statusCode);
      response.setHeader('X-Cache-Lookup', 'HIT');
      return of(cached.body);
    }

    return next.handle().pipe(
      tap((body) => {
        IDEMPOTENCY_CACHE.set(cacheKey, {
          statusCode: response.statusCode,
          body,
          timestamp: Date.now(),
        });
      })
    );
  }
}

