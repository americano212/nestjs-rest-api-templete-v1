import { Injectable } from '@nestjs/common';
import { UsersRepository } from 'src/shared/user';

import { LocalLoginDto } from './dto';
import { JwtSign } from '.';

// https://soraji.github.io/back/2022/12/15/sociallogin/

@Injectable()
export class AuthService {
  constructor(private readonly usersRepository: UsersRepository) {}

  public async localLogin(loginData: LocalLoginDto): Promise<JwtSign> {
    const user = await this.usersRepository.getByUsername(loginData.username);

    // TODO add logic
    console.log(user);
    return { access_token: 'test', refresh_token: 'test' };
  }
}
