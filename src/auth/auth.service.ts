import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ConfigService, UtilService } from '../common';
import { User, UsersRepository } from '../shared/user';
import { IOAuthUser, JwtPayload, JwtSign, Payload } from './auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwt: JwtService,
    private readonly util: UtilService,
    private readonly config: ConfigService,
  ) {}

  public async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersRepository.getByEmail(email);
    if (!user) return null;
    if (!user.passwordHash) return null;
    const isMatch = await this.util.passwordCompare(password, user.passwordHash);
    if (!isMatch) return null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...userWithoutPasswordHash } = user;
    return userWithoutPasswordHash;
  }

  public async validateSocialUser(socialUser: IOAuthUser): Promise<User> {
    // TODO 있었던 user인지 확인
    const user = await this.usersRepository.getByEmail(socialUser.email);
    if (!user) return this.socialRegistor(socialUser);
    // 이메일은 존재하는데 vender가 다름 or
    if (socialUser.vendor !== user?.vendor) {
      // 이미 가입되어 있다 하고 ERR throw
    }
    if (socialUser.social_id !== user?.social_id)
      //TODO ID가 다름?
      console.log('socail_user', socialUser);
    return user;
  }

  private async socialRegistor(socialUser: IOAuthUser): Promise<User> {
    const user = await this.usersRepository.create({ ...socialUser, roles: [] });
    // TODO Exception
    return user;
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
      expiresIn: this.config.get('jwt.accessTokenExpire'),
      secret: this.config.get('jwt.accessSecret'),
    });
  }

  private async generateRefreshToken(sub: number): Promise<string> {
    return this.jwt.signAsync(
      { sub },
      {
        expiresIn: this.config.get('jwt.refreshTokenExpire'),
        secret: this.config.get('jwt.refreshSecret'),
      },
    );
  }
}
