import { User } from '#entities/index';
import { PickType } from '@nestjs/mapped-types';

export class SNSUserDto extends PickType(User, [
  'username',
  'email',
  'social_id',
  'vendor' as const,
]) {}
