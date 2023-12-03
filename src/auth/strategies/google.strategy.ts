import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env['GOOGLE_CLIENT_ID'],
      clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
      callbackURL: process.env['GOOGLE_CALLBACK_URL'],
      scope: ['profile', 'email'],
    });
  }

  // refreshToken을 얻고 싶다면 해당 메서드 설정 필수
  override authorizationParams(): { [key: string]: string } {
    return {
      access_type: 'offline',
      prompt: 'select_account',
    };
  }

  public async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: CallableFunction,
  ): Promise<void> {
    console.log('profile', profile);
    console.log('accessToken', accessToken);
    console.log('accessToken', refreshToken);
    const temp_user = {
      user_id: 1,
      username: 'temp',
      roles: [],
    };
    return done(null, temp_user);
  }
}
