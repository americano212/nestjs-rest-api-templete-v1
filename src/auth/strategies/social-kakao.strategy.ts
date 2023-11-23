import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { AuthService } from '../auth.service';
import { IOAuthUser, Payload } from '../auth.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(private readonly auth: AuthService) {
    super({
      // TODO env 주입방법을 수정할 수 없을지
      clientID: process.env['KAKAO_CLIENT_ID'],
      clientSecret: process.env['KAKAO_CLIENT_SECRET'],
      callbackURL: process.env['KAKAO_CALLBACK_URL'],
      scope: ['profile_nickname'],
    });
  }

  public async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: CallableFunction,
  ): Promise<Payload> {
    const social_user: IOAuthUser = {
      username: profile.displayName,
      email: profile._json.kakao_account.email,
      social_id: profile.id,
      vendor: 'kakao',
    };
    console.log('accessToken : ' + accessToken);
    console.log('refreshToken : ' + refreshToken);
    console.log(profile);
    console.log('social_user2', social_user);
    const user = await this.auth.validateSocialUser(social_user);
    console.log('user', user);
    return done(null, user);
  }
}
