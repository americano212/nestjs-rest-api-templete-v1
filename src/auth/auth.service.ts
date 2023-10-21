import { Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { User, UsersRepository } from 'src/shared/user';

import { LocalLoginDto } from './dto';
import { JwtSign } from '.';

// https://soraji.github.io/back/2022/12/15/sociallogin/

@Injectable()
export class AuthService {
  constructor(private readonly usersRepository: UsersRepository) {}

  public async localLogin(loginData: LocalLoginDto): Promise<JwtSign | null> {
    const user = await this.usersRepository.getByUsername(loginData.username);
    console.log(user);
    if (!user) return null;
    // TODO add logic

    return { access_token: 'test', refresh_token: 'test' };
  }

  public async validateUser(
    username: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.usersRepository.getByUsername(username);
    const saltOrRounds = 10;
    console.log(password, saltOrRounds);
    const hash = await bcrypt.hash(password, saltOrRounds);

    if (user?.passwordHash === hash) {
      const { passwordHash, ...result } = user;
      console.log(passwordHash);
      return result;
    }

    return null;
  }
}
