import { Global, Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { LoggerContextMiddleware } from './middleware';
import * as providers from './providers';
import { JwtModule } from '@nestjs/jwt';

const services = [Logger, ...Object.values(providers)];

@Global()
@Module({
  imports: [JwtModule.register({})],
  providers: services,
  exports: services,
})
export class CommonModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerContextMiddleware).forRoutes('*');
  }
}
