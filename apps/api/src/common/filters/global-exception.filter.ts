import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { DomainError, AppErrorCode } from '@mvp/shared';
import { ZodError } from 'zod';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code: string = AppErrorCode.INTERNAL_SERVER_ERROR;
    let message = 'Ocorreu um erro interno no servidor.';
    let details: unknown = undefined;

    if (exception instanceof DomainError) {
      status = HttpStatus.UNPROCESSABLE_ENTITY;
      code = exception.code;
      message = exception.message;
      details = exception.details;
    } else if (exception instanceof ZodError) {
      status = HttpStatus.BAD_REQUEST;
      code = AppErrorCode.BAD_REQUEST;
      message = 'Erro de validação dos dados de entrada.';
      details = exception.format();
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      code = HttpStatus[status] || AppErrorCode.BAD_REQUEST;
      const res = exception.getResponse();
      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        message = (res as { message?: string }).message || exception.message;
        details = res;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    response.status(status).json({
      code,
      message,
      details,
      timestamp: new Date().toISOString(),
    });
  }
}

