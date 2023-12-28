import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Board, Content } from '#entities/board';

import { BoardController } from './board.controller';
import * as providers from './providers';
import * as guards from './guards';

const services = [...Object.values(providers), ...Object.values(guards)];

@Module({
  imports: [TypeOrmModule.forFeature([Board, Content])],
  controllers: [BoardController],
  providers: services,
  exports: services,
})
export class BoardModule {}
