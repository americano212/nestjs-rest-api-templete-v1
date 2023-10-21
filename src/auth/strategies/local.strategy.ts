import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import type { Payload } from '../auth.interface';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private auth: AuthService) {
    super();
  }

  public async validate(username: string, password: string): Promise<Payload> {
    const user = await this.auth.validateUser(username, password);
    console.log('user', user);
    if (!user) throw new UnauthorizedException('NotFoundUser');

    return {
      user_id: user.user_id,
      username: user.username,
      roles: user.roles,
    };
  }
}
