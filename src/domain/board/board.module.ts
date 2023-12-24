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
