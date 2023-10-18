import { Injectable } from '@nestjs/common';
import { UserDto } from './user.dto';

@Injectable()
export class UserService {
  public async fetch(user_id: number): Promise<UserDto & { roles: string[] }> {
    return Promise.resolve({
      user_id: user_id,
      username: 'testUser',
      email: 'testUser@test.com',
      roles: ['Admin'],
    });
  }
}
