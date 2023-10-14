import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { configuration } from './config';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './common/guards/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Global 모듈로 설정
      load: [configuration],
    }),
    CommonModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
