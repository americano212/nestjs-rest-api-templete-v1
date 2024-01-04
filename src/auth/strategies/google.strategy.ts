import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';

import { UserService } from '../../../src/shared/user';
import { AuthService } from '../auth.service';
import { SNSUserDto } from 'src/shared/user/dto';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly auth: AuthService,
    private readonly user: UserService,
  ) {
    super({
      clientID: process.env['GOOGLE_CLIENT_ID'],
      clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
      callbackURL: process.env['GOOGLE_CALLBACK_URL'],
      scope: ['profile', 'email'],
    });
  }

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
    const googleUser: SNSUserDto = {
      username: profile.displayName,
      email: profile._json.email || '',
      social_id: profile.id,
      vendor: 'google',
    };
    console.log('accessToken : ' + accessToken);
    console.log('refreshToken : ' + refreshToken);
    const isExistEmail = await this.user.isExistEmail(googleUser.email);

    const user = isExistEmail
      ? await this.auth.validateSNSUser(googleUser)
      : await this.user.createSNSUser(googleUser);
    return done(null, user);
  }
}
