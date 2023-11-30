import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';

@Injectable()
export class NaverLoginGuard extends AuthGuard('naver') implements CanActivate {
  public override async canActivate(context: ExecutionContext): Promise<boolean> {
    const result = <boolean>await super.canActivate(context);
    const request = context.switchToHttp().getRequest<Request>();
    await super.logIn(request);
    return result;
  }
}
