import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-naver-v2';

import { UserService } from '../../../src/shared/user/user.service';
import { AuthService } from '../auth.service';
import { Payload } from '../auth.interface';
import { SNSUserDto } from 'src/shared/user/dto';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor(
    private readonly auth: AuthService,
    private readonly user: UserService,
  ) {
    super({
      clientID: process.env['NAVER_CLIENT_ID'],
      clientSecret: process.env['NAVER_CLIENT_SECRET'],
      callbackURL: process.env['NAVER_CALLBACK_URL'],
    });
  }

  public async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: CallableFunction,
  ): Promise<Payload> {
    const naverUser: SNSUserDto = {
      username: profile.name || '',
      email: profile.email || '',
      socialId: profile.id,
      vendor: 'naver',
    };
    console.log('accessToken : ' + accessToken);
    console.log('refreshToken : ' + refreshToken);

    // 계정 존재 유무 체크
    const isExistEmail = await this.user.isExistEmail(naverUser.email);

    const user = isExistEmail
      ? await this.auth.validateSNSUser(naverUser)
      : await this.user.createSNSUser(naverUser);

    return done(null, user);
  }
}
