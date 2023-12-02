import { Role } from '#entities/role.entity';
import { UserRole } from '#entities/user-role.entity';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RoleController } from './role.controller';
import * as providers from './providers';

const services = Object.values(providers);

@Module({
  imports: [TypeOrmModule.forFeature([Role, UserRole])],
  controllers: [RoleController],
  providers: services,
  exports: services,
})
export class RoleModule {}
