import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { ConfigService } from 'src/common';

export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(private readonly config: ConfigService) {
    super({
      // TODO env 주입방법을 수정할 수 없을지
      clientID: process.env['KAKAO_CLIENT_ID'],
      clientSecret: process.env['KAKAO_CLIENT_SECRET'],
      callbackURL: process.env['KAKAO_CALLBACK_URL'],
      scope: ['account_email', 'profile_nickname'],
    });
  }
  async validate(accessToken: string, refreshToken: string, profile: any) {
    console.log('accessToken' + accessToken);
    console.log('refreshToken' + refreshToken);
    console.log(profile);
    console.log(profile._json.kakao_account.email);
    console.log(this.config);
    return {
      name: profile.displayName,
      email: profile._json.kakao_account.email,
      password: profile.id,
    };
  }
}
