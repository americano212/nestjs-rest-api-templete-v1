import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { User } from '#entities/index';

import { ConfigService, UtilService } from '../common';
import { UsersRepository } from '../shared/user/user.repository';
import { JwtPayload, JwtSign, Payload } from './auth.interface';
import { SNSUserDto } from 'src/shared/user/dto';
import { NullableType } from 'src/common/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwt: JwtService,
    private readonly util: UtilService,
    private readonly config: ConfigService,
  ) {}

  public async validateUser(email: string, password: string): Promise<NullableType<User>> {
    const user = await this.usersRepository.findOneByEmail(email);
    if (!user) return null;
    if (!user.passwordHash) return null;
    const isMatch = await this.util.passwordCompare(password, user.passwordHash);
    if (!isMatch) return null;
    delete user.passwordHash;
    return user;
  }

  public async validateSNSUser(snsUserData: SNSUserDto): Promise<User> {
    const user = await this.usersRepository.findOneByEmail(snsUserData.email);
    if (!user) throw Error();
    if (snsUserData.vendor !== user.vendor)
      throw new HttpException(`Email already exists in ${user.vendor}`, HttpStatus.BAD_REQUEST);
    return user;
  }

  public async jwtSign(data: Payload): Promise<JwtSign> {
    const payload: JwtPayload = {
      sub: data.userId,
      username: data.username,
      roles: data.roles,
    };
    const accessToken = await this.generateAccessToken(payload);
    const refreshToken = await this.generateRefreshToken(payload.sub);
    await this.usersRepository.setRefreshToken(data.userId, refreshToken);
    return { accessToken, refreshToken };
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

  public jwtVerify(token: string): Payload | null {
    try {
      const payload = <JwtPayload | null>this.jwt.decode(token);
      if (!payload) return null;
      return { userId: payload.sub, username: payload.username, roles: payload.roles };
    } catch {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }
}
