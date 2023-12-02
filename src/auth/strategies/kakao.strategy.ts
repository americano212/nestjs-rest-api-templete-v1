import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';

import { SNSUser, UserService } from '../../../src/shared/user';
import { AuthService } from '../auth.service';
import { Payload } from '../auth.interface';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(
    private readonly auth: AuthService,
    private readonly user: UserService,
  ) {
    super({
      clientID: process.env['KAKAO_CLIENT_ID'],
      clientSecret: process.env['KAKAO_CLIENT_SECRET'],
      callbackURL: process.env['KAKAO_CALLBACK_URL'],
      scope: ['profile_nickname', 'account_email'],
    });
  }

  public async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: CallableFunction,
  ): Promise<Payload> {
    const kakaoUser: SNSUser = {
      username: profile.displayName,
      email: profile._json.kakao_account.email,
      social_id: String(profile.id),
      vendor: 'kakao',
    };
    console.log('accessToken : ' + accessToken);
    console.log('refreshToken : ' + refreshToken);
    const isExistEmail = await this.user.isExistEmail(kakaoUser.email);

    const user = isExistEmail
      ? await this.auth.validateSNSUser(kakaoUser)
      : await this.user.createSNSUser(kakaoUser);
    return done(null, user);
  }
}
