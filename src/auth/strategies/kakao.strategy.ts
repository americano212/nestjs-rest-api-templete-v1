import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';

import { UserService } from 'src/shared/user/user.service';
import { AuthService } from '../auth.service';
import { Payload } from '../auth.interface';
import { SNSUserDto } from 'src/shared/user/dto';

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
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: CallableFunction,
  ): Promise<Payload> {
    const kakaoUser: SNSUserDto = {
      username: profile.displayName,
      email: profile._json.kakao_account.email,
      socialId: String(profile.id),
      vendor: 'kakao',
    };

    let user = await this.auth.validateSNSUser(kakaoUser);
    user = user ? user : await this.user.createSNSUser(kakaoUser);
    return done(null, user);
  }
}
