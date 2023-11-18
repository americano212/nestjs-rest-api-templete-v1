import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { ConfigService } from './config.service';

@Injectable()
export class UtilService {
  constructor(private config: ConfigService) {}

  public async passwordEncoding(password: string): Promise<string> {
    const saltOrRounds = this.config.get('bcrypt.salt');
    const passwordHash = await bcrypt.hash(password, saltOrRounds);
    return passwordHash;
  }

  public async passwordCompare(password: string, passwordHash: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(password, passwordHash);
    return isMatch;
  }
}
