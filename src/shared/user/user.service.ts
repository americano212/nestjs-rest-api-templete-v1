import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { CreateUserDto, UserDto } from './dto';
import { UsersRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly usersRepository: UsersRepository) {}

  public async create(userData: CreateUserDto): Promise<UserDto> {
    const user = await this.usersRepository.create(userData);
    return user;
  }

  public async getByUsername(username: string): Promise<UserDto | null> {
    const user = await this.usersRepository.getByUsername(username);
    return user;
  }

  public async fetch(user_id: number): Promise<UserDto & { roles: string[] }> {
    const saltOrRounds = 10;
    const password = 'test_password';
    const hash = await bcrypt.hash(password, saltOrRounds);
    return Promise.resolve({
      user_id: user_id,
      username: 'test_user',
      passwordHash: hash,
      email: 'testUser@test.com',
      roles: ['Admin'],
    });
  }
}
