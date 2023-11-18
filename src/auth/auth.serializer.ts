import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

import type { Payload } from './auth.interface';

@Injectable()
export class AuthSerializer extends PassportSerializer {
  public serializeUser(user: Payload, done: (err: Error | null, data?: Payload) => void): void {
    done(null, user);
  }

  public deserializeUser(data: Payload, done: (err: Error | null, user?: Payload) => void): void {
    try {
      // TODO 찾아보고 수정
      done(null, data);
    } catch (err) {
      done(<Error>err);
    }
  }
}
