import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-naver-v2';

import { SNSUser, UserService } from '../../../src/shared/user';
import { AuthService } from '../auth.service';
import { Payload } from '../auth.interface';

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
    const naverUser: SNSUser = {
      username: profile.name || '',
      email: profile.email || '',
      social_id: profile.id,
      vendor: 'naver',
    };
    console.log('profile : ', profile);
    console.log('accessToken : ' + accessToken);
    console.log('refreshToken : ' + refreshToken);
    console.log('_json : ', profile._json);

    // 계정 존재 유무 체크
    const isExistEmail = await this.user.isExistEmail(naverUser.email);

    const user = isExistEmail
      ? await this.auth.validateSNSUser(naverUser)
      : await this.user.createSNSUser(naverUser);
    return done(null, user);
  }
}
