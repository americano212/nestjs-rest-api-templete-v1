import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import type { Payload } from '../auth.interface';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private auth: AuthService) {
    super({ usernameField: 'email' });
  }

  public async validate(email: string, password: string, done: CallableFunction): Promise<Payload> {
    const user = await this.auth.validateUser(email, password);
    if (!user) throw new UnauthorizedException('user NotFound');

    return done(null, user);
  }
}
