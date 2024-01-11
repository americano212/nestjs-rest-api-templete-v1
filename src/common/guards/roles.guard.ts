import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from '../decorators';
import { Role } from '../enums';
import { AuthService, Payload } from '../../../src/auth';
import { Request } from 'express';

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

    const { headers } = context.switchToHttp().getRequest<Request>();
    if (!headers.authorization) return false;

    const jwtToken = headers.authorization.split('Bearer ')[1];
    const payload: Payload | null = this.auth.jwtVerify(jwtToken);
    if (!payload) return false;

    const userRoles: string[] = [];
    payload.roles?.forEach((role) => {
      userRoles.push(role.roleName);
    });

    return requiredRoles.some((role) => userRoles?.includes(role));
  }
}
