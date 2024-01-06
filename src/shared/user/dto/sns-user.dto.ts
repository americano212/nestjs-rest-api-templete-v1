import { PickType } from '@nestjs/swagger';

import { User } from '#entities/index';

export class SNSUserDto extends PickType(User, [
  'username',
  'email',
  'socialId',
  'vendor',
] as const) {}
