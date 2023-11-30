import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-naver-v2';

import { Payload } from '../auth.interface';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor() {
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

    // TODO 정책추가
    // 계정 존재 유무 체크
    // if 회원가입
    // else 로그인
    return done(null, profile);
  }
}
