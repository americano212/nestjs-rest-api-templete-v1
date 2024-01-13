import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-naver-v2';

import { UserService } from '../../../src/shared/user/user.service';
import { AuthService } from '../auth.service';
import { Payload } from '../auth.interface';
import { SNSUserDto } from 'src/shared/user/dto';

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
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: CallableFunction,
  ): Promise<Payload> {
    const naverUser: SNSUserDto = {
      username: profile.name || '',
      email: profile.email || '',
      socialId: profile.id,
      vendor: 'naver',
    };

    let user = await this.auth.validateSNSUser(naverUser);
    user = user ? user : await this.user.createSNSUser(naverUser);
    return done(null, user);
  }
}
