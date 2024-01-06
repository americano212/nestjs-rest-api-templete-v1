import { PickType } from '@nestjs/swagger';

import { User } from '#entities/index';

export class SNSUserDto extends PickType(User, [
  'username',
  'email',
  'social_id',
  'vendor',
] as const) {}
