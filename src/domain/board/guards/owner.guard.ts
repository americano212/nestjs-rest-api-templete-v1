import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import type { Request } from 'express';

import { AuthService, Payload } from 'src/auth';
import { Reflector } from '@nestjs/core';
import { OwnerGuardType } from '../enums';
import { OWNER_GUARD_KEY } from '../decorator';
import { Role } from 'src/common';
import { ContentService } from '../providers';

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(
    private readonly content: ContentService,
    private readonly auth: AuthService,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const guardType = this.reflector.get<OwnerGuardType>(OWNER_GUARD_KEY, context.getHandler());

    const { params, headers } = context.switchToHttp().getRequest<Request>();

    const headerAuthorization = headers.authorization;
    if (!headerAuthorization) return false;
    const userRoles = await this.getUserRoles(headerAuthorization);
    if (userRoles.includes(Role.SuperAdmin) || userRoles.includes(Role.Admin)) return true;

    const userId = await this.getUserId(headerAuthorization);

    let owner: number = -1;
    if (guardType === OwnerGuardType.CONTENT_OWNER) {
      const boardName = params['board_name'];
      const contentId = Number(params['content_id']);
      const { user } = await this.content.findOne(boardName, contentId);
      owner = user ? user.user_id : -1;
    }

    return userId === owner ? true : false;
  }

  private async getUserRoles(headerAuthorization: string): Promise<string[]> {
    const jwtToken = headerAuthorization.split('Bearer ')[1];
    const payload: Payload | null = this.auth.jwtVerify(jwtToken);
    if (!payload) return [];
    return payload.roles ? payload.roles : [];
  }

  private async getUserId(headerAuthorization: string): Promise<number> {
    const jwtToken = headerAuthorization.split('Bearer ')[1];
    const payload: Payload | null = this.auth.jwtVerify(jwtToken);
    if (!payload) return 0;
    return payload.user_id ? payload.user_id : 0;
  }
}
