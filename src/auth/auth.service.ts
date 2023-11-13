import { Injectable } from '@nestjs/common';

import { ConfigService, UtilService } from 'src/common';
import { User, UsersRepository } from 'src/shared/user';
import { JwtPayload, JwtSign, Payload } from './auth.interface';
import { JwtService } from '@nestjs/jwt';

// https://soraji.github.io/back/2022/12/15/sociallogin/

enum EXPIRE_TIME {
  ACCESS_TOKEN = '1d',
  REFRESH_TOKEN = '30d',
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwt: JwtService,
    private readonly util: UtilService,
    private readonly config: ConfigService,
  ) {}

  public async validateUser(
    email: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.usersRepository.getByEmail(email);
    if (!user) return null;
    const isMatch = await this.util.passwordCompare(
      password,
      user?.passwordHash,
    );
    if (!isMatch) return null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  public async jwtSign(data: Payload): Promise<JwtSign> {
    const payload: JwtPayload = {
      sub: data.user_id,
      username: data.username,
      roles: data.roles,
    };
    const access_token = await this.generateAccessToken(payload);
    const refresh_token = await this.generateRefreshToken(payload.sub);
    await this.usersRepository.setRefreshToken(data.user_id, refresh_token);
    return {
      access_token,
      refresh_token,
    };
  }

  private async generateAccessToken(payload: JwtPayload): Promise<string> {
    return this.jwt.signAsync(payload, {
      expiresIn: EXPIRE_TIME.ACCESS_TOKEN,
      secret: this.config.get('jwt.accessSecret'),
    });
  }

  private async generateRefreshToken(sub: number): Promise<string> {
    return this.jwt.signAsync(
      { sub },
      {
        expiresIn: EXPIRE_TIME.REFRESH_TOKEN,
        secret: this.config.get('jwt.refreshSecret'),
      },
    );
  }
}
