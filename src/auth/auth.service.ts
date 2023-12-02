import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ConfigService, UtilService } from '../common';
import { SNSUser, User, UsersRepository } from '../shared/user';
import { JwtPayload, JwtSign, Payload } from './auth.interface';

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

  public async validateSNSUser(socialUser: SNSUser): Promise<User> {
    const user = await this.usersRepository.getByEmail(socialUser.email);
    if (!user) throw new HttpException('UNKNOWN ERROR', HttpStatus.BAD_REQUEST);
    if (socialUser.vendor !== user?.vendor || socialUser.social_id !== user?.social_id)
      throw new HttpException(
        `User's Email already exists in ${user.vendor}`,
        HttpStatus.BAD_REQUEST,
      );
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

  public async jwtVerify(token: string): Promise<Payload> {
    try {
      return await this.jwt.verifyAsync(token, {
        secret: this.config.get('jwt.accessSecret'),
      });
    } catch {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }
}
