import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import type { Request } from 'express';

import { AuthService, Payload } from 'src/auth';
import { Reflector } from '@nestjs/core';
import { OwnerGuardType } from '../enums';
import { OWNER_GUARD_KEY } from '../decorator';
import { Role } from 'src/common';
import { ContentService } from '../providers';

enum UNABLE_USER_ID {
  OWNER_NOT_EXIST = -1,
  REQ_USER_NOT_EXIST = 0,
}

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(
    private readonly content: ContentService,
    private readonly auth: AuthService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const guardType = this.reflector.get<OwnerGuardType>(OWNER_GUARD_KEY, context.getHandler());
    if (!guardType) return true;

    const { params, headers } = context.switchToHttp().getRequest<Request>();

    const headerAuthorization = headers.authorization;
    if (!headerAuthorization) return false;

    const userRoles = await this.getUserRoles(headerAuthorization);
    if (userRoles.includes(Role.SuperAdmin)) return true;

    if (guardType === OwnerGuardType.ONLY_ADMIN) {
      return userRoles.includes(Role.SuperAdmin) || userRoles.includes(Role.Admin) ? true : false;
    }

    const userId = await this.getUserId(headerAuthorization);

    let owner: number = UNABLE_USER_ID.OWNER_NOT_EXIST;

    if (guardType === OwnerGuardType.CONTENT_OWNER) {
      const boardName = params['board_name'];
      const contentId = Number(params['content_id']);
      const { user } = await this.content.findOne(boardName, contentId);
      owner = user ? user.user_id : UNABLE_USER_ID.OWNER_NOT_EXIST;
    }
    if (guardType === OwnerGuardType.REPLY_OWNER) {
      // TODO
    }

    return userId === owner ? true : false;
  }

  private async getUserRoles(headerAuthorization: string): Promise<string[]> {
    const jwtToken = headerAuthorization.split('Bearer ')[1];
    const payload: Payload | null = this.auth.jwtVerify(jwtToken);
    if (!payload) return [];
    const roles: string[] = [];
    payload.roles?.forEach((role) => {
      roles.push(role.role_name);
    });
    return roles;
  }

  private async getUserId(headerAuthorization: string): Promise<number> {
    const jwtToken = headerAuthorization.split('Bearer ')[1];
    const payload: Payload | null = this.auth.jwtVerify(jwtToken);
    if (!payload) return UNABLE_USER_ID.REQ_USER_NOT_EXIST;

    return payload.user_id ? payload.user_id : UNABLE_USER_ID.REQ_USER_NOT_EXIST;
  }
}
