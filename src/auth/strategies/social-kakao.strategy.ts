import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { AuthService } from '../auth.service';

export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(private auth: AuthService) {
    super({
      // TODO env 주입방법을 수정할 수 없을지
      clientID: process.env['KAKAO_CLIENT_ID'],
      clientSecret: process.env['KAKAO_CLIENT_SECRET'],
      callbackURL: process.env['KAKAO_CALLBACK_URL'],
      scope: ['profile_nickname'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: CallableFunction) {
    const username = profile.displayName;
    const email = profile._json.kakao_account.email;
    const id = profile.id;
    console.log('accessToken : ' + accessToken);
    console.log('refreshToken : ' + refreshToken);
    console.log(profile);
    const user = await this.auth.validateSocialUser(username, email, id);
    return done(null, user);
  }
}
