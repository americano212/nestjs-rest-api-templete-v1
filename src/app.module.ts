import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

import { AuthModule } from './auth';
import { CommonModule } from './common';
import { BaseModule } from './base';

import { AppController } from './app.controller';
import { configuration } from './config';
import { RolesGuard } from './common/guards/roles.guard';
import { ExceptionsFilter } from './common/filters';
import { ErrorsInterceptor } from './common/interceptors';
import { DomainModule } from './domain';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Global 모듈로 설정
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        ...config.get<TypeOrmModuleOptions>('db'),
      }),
      inject: [ConfigService],
      async dataSourceFactory(option) {
        if (!option) throw new Error('Invalid options passed');
        return addTransactionalDataSource(new DataSource(option));
      },
    }),
    AuthModule,
    CommonModule,
    BaseModule,
    DomainModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_FILTER,
      useClass: ExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorsInterceptor,
    },
  ],
})
export class AppModule {}
