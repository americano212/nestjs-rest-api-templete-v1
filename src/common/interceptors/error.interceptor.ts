import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

import { catchError, throwError } from 'rxjs';
import { SlackService } from '../providers';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  constructor(private slackService: SlackService) {}

  intercept(_: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      catchError((err) => {
        const isProduction = process.env['NODE_ENV'] === 'production';
        if (isProduction) this.slackService.sendSlackMessage(`🚨${err}🚨`);
        return throwError(() => err);
      }),
    );
  }
}
