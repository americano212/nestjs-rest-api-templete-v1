import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-naver-v2';

import { Payload } from '../auth.interface';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor() {
    super({
      // TODO env 주입방법을 수정할 수 없을지
      clientID: process.env['NAVER_CLIENT_ID'],
      clientSecret: process.env['NAVER_CLIENT_SECRET'],
      callbackURL: process.env['NAVER_CALLBACK_URL'],
    });
  }

  public async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: CallableFunction,
  ): Promise<Payload> {
    // const socialUser: SocialUser = {
    //   username: profile.displayName,
    //   email: profile._json.kakao_account.email,
    //   social_id: String(profile.id),
    //   vendor: 'naver',
    // };c
    console.log('profile : ', profile);
    console.log('accessToken : ' + accessToken);
    console.log('refreshToken : ' + refreshToken);
    //const user = await this.auth.validateSocialUser(socialUser);
    return done(null, profile);
  }
}
