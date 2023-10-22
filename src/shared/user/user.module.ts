import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '#entities/user.entity';
import { UserService } from './user.service';
import { UsersRepository } from './user.repository';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, UsersRepository],
  exports: [UsersRepository],
})
export class UserModule {}
