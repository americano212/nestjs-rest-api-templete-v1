import { Injectable } from '@nestjs/common';
import { UserDto } from './user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
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
