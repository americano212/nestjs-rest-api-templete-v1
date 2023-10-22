import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { LocalRegisterDto, UserDto } from './dto';
import { UsersRepository } from './user.repository';
import { UtilService } from 'src/common';

@Injectable()
export class UserService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly util: UtilService,
  ) {}

  public async create(userData: LocalRegisterDto): Promise<boolean> {
    // TODO Check logic for already exist user
    const { password, ...userDataExceptPassword } = userData;
    const passwordHash = await this.util.passwordEncoding(password);

    const user = await this.usersRepository.create({
      passwordHash,
      ...userDataExceptPassword,
    });
    console.log(user);
    return true;
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
