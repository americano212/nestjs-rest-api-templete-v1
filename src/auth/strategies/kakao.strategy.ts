import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { AuthService } from '../auth.service';
import { SocialUser, Payload } from '../auth.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(private readonly auth: AuthService) {
    super({
      // TODO env 주입방법을 수정할 수 없을지
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
    const socialUser: SocialUser = {
      username: profile.displayName,
      email: profile._json.kakao_account.email,
      social_id: String(profile.id),
      vendor: 'kakao',
    };
    // KAKAO Access token 이 필요하면 나중에 쿠키에 넣는 방향으로
    console.log('accessToken : ' + accessToken);
    console.log('refreshToken : ' + refreshToken);
    const user = await this.auth.validateSocialUser(socialUser);
    return done(null, user);
  }
}
