import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from '../decorators';
import { Role } from '../enums';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(), // Method Roles
      context.getClass(), // Controller Roles
    ]);
    console.log('requiredRoles', requiredRoles);
    if (!requiredRoles) return true;

    const { cookies } = context.switchToHttp().getRequest();
    console.log('cookies', cookies);
    console.log('AC', cookies.access_token);
    if (!cookies.access_token) return false;

    // TODO 쿠키 검증 정책 추가
    return requiredRoles.some((role) => cookies.roles?.includes(role));
  }
}
