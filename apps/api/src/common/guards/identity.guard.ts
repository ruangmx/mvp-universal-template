import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator.js';

export interface UserIdentity {
  id: string;
  email: string;
  name: string;
  role: string;
}

@Injectable()
export class IdentityGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();

    // Em desenvolvimento ou atrás de reverse proxy/auth-forward:
    // Extrai dos headers ou injeta a identidade mock de desenvolvimento
    const user: UserIdentity = {
      id: request.headers['x-user-id'] || '00000000-0000-0000-0000-000000000001',
      email: request.headers['x-user-email'] || 'dev@mvp.local',
      name: request.headers['x-user-name'] || 'Desenvolvedor MVP',
      role: request.headers['x-user-role'] || 'admin',
    };

    request.user = user;

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const hasRole = requiredRoles.includes(user.role) || user.role === 'admin';
    if (!hasRole) {
      throw new ForbiddenException(
        `Acesso negado: seu usuário não possui as permissões necessárias (${requiredRoles.join(', ')}).`
      );
    }

    return true;
  }
}

