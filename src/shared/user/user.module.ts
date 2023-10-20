import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '#entities/user.entity';
import { UserService } from './user.service';
import { UsersRepository } from './user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, UsersRepository],
  exports: [UsersRepository],
})
export class UserModule {}
