import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from '../decorators';
import { Role } from '../enums';
import { AuthService } from 'src/auth';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly auth: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
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
    console.log(await this.auth.jwtVerify(cookies.access_token));
    return requiredRoles.some((role) => cookies.roles?.includes(role));
  }
}
