import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from '../decorators';
import { Role } from '../enums';
import { AuthService, Payload } from 'src/auth';

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

    const payload: Payload = await this.auth.jwtVerify(cookies.access_token);
    console.log('payload', payload);
    console.log(
      'isRole? : ',
      requiredRoles.some((role) => payload.roles?.includes(role)),
    );
    return requiredRoles.some((role) => payload.roles?.includes(role));
  }
}
