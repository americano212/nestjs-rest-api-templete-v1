import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  public override getRequest(context: ExecutionContext): Request {
    return context.switchToHttp().getRequest<Request>();
  }
}
