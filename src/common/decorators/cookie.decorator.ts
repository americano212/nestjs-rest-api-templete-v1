import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

export const Cookies = createParamDecorator((data: string, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest<Request>();
  return data ? request.cookies?.[data] : request.cookies;
});
