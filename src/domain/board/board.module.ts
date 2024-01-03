import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Board, Content } from '#entities/board';

import * as controllers from './controllers';
import * as providers from './providers';
import * as guards from './guards';

const services = [...Object.values(providers), ...Object.values(guards)];

@Module({
  imports: [TypeOrmModule.forFeature([Board, Content])],
  controllers: Object.values(controllers),
  providers: services,
  exports: services,
})
export class BoardModule {}
