import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { AuthService } from '../auth.service';
import { Payload } from '../auth.interface';
import { Injectable } from '@nestjs/common';
import { SNSUser, UserService } from 'src/shared/user';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(
    private readonly auth: AuthService,
    private readonly user: UserService,
  ) {
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
    const kakaoUser: SNSUser = {
      username: profile.displayName,
      email: profile._json.kakao_account.email,
      social_id: String(profile.id),
      vendor: 'kakao',
    };
    // KAKAO Access token 이 필요하면 나중에 쿠키에 넣는 방향으로
    console.log('accessToken : ' + accessToken);
    console.log('refreshToken : ' + refreshToken);
    // 계정 있는지 확인
    const isExistEmail = await this.user.isExistEmail(kakaoUser.email);
    console.log('isExistEmail', isExistEmail);
    if (!isExistEmail) {
      return done(null, await this.user.createSNSUser(kakaoUser));
    } else {
      return done(null, await this.auth.validateSNSUser(kakaoUser));
    }
  }
}
