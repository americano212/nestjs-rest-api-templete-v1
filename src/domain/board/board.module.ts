import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Board, Content } from '#entities/board';

import { BoardController } from './board.controller';
import * as providers from './providers';

const services = Object.values(providers);

@Module({
  imports: [TypeOrmModule.forFeature([Board, Content])],
  controllers: [BoardController],
  providers: services,
  exports: services,
})
export class BoardModule {}

//https://velog.io/@from_numpy/NestJS-Pagination-with-TypeORM-feat-Refactoring#%EA%B4%80%EC%8B%AC-%EB%B6%84%EB%A6%AC%EB%A5%BC-%ED%86%B5%ED%95%9C-%EB%A6%AC%ED%8E%99%ED%86%A0%EB%A7%81-%EA%B5%AC%ED%98%84
