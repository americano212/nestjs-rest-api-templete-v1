import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

import { BoardService } from '../providers';
import { AuthService, Payload } from 'src/auth';

@Injectable()
export class BoardReadGuard implements CanActivate {
  constructor(
    private readonly board: BoardService,
    private readonly auth: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { params, headers } = context.switchToHttp().getRequest<Request>();

    const boardName = params['board_name'];
    const boardReadRequiredRoles = await this.getBoardReadRequiredRoles(boardName);
    if (!boardReadRequiredRoles.length) return true;

    const headerAuthorization = headers.authorization;
    if (!headerAuthorization) return false;
    const userRoles = await this.getUserRoles(headerAuthorization);

    return boardReadRequiredRoles.every((role) => userRoles.includes(role));
  }

  private async getBoardReadRequiredRoles(boardName: string): Promise<string[]> {
    const { board_read_roles } = await this.board.findByBoardName(boardName);
    return board_read_roles;
  }

  private async getUserRoles(headerAuthorization: string): Promise<string[]> {
    const jwtToken = headerAuthorization.split('Bearer ')[1];
    const payload: Payload | null = this.auth.jwtVerify(jwtToken);
    if (!payload) return [];
    return payload.roles ? payload.roles : [];
  }
}
