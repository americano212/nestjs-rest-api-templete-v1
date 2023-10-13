import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { configuration } from './config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Global 모듈로 설정
      load: [configuration],
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
