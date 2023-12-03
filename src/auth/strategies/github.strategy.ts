import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-github2';

import { SNSUser, UserService } from '../../../src/shared/user';
import { AuthService } from '../auth.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private readonly auth: AuthService,
    private readonly user: UserService,
  ) {
    super({
      clientID: process.env['GITHUB_CLIENT_ID'],
      clientSecret: process.env['GITHUB_CLIENT_SECRET'],
      callbackURL: process.env['GITHUB_CALLBACK_URL'],
      scope: ['user:email'],
    });
  }

  public async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: CallableFunction,
  ): Promise<void> {
    if (!profile.emails) throw new HttpException('oauth login need email', HttpStatus.BAD_REQUEST);
    const githubUser: SNSUser = {
      username: profile.displayName,
      email: profile.emails[0].value,
      social_id: profile.id,
      vendor: 'github',
    };
    console.log('accessToken : ' + accessToken);
    console.log('refreshToken : ' + refreshToken);
    const isExistEmail = await this.user.isExistEmail(githubUser.email);

    const user = isExistEmail
      ? await this.auth.validateSNSUser(githubUser)
      : await this.user.createSNSUser(githubUser);
    return done(null, user);
  }
}
