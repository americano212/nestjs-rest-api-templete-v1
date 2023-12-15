import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from '../decorators';
import { Role } from '../enums';
import { AuthService, Payload } from '../../../src/auth';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly auth: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;

    const { cookies } = context.switchToHttp().getRequest();
    if (!cookies.access_token) return false;

    const payload: Payload | null = this.auth.jwtVerify(cookies.access_token);
    if (!payload) return false;

    return requiredRoles.some((role) => payload.roles?.includes(role));
  }
}
