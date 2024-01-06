import { User } from '#entities/user.entity';
import { PickType } from '@nestjs/swagger';

export class CreateUserDto extends PickType(User, [
  'username',
  'passwordHash',
  'email',
  'vendor',
  'social_id',
] as const) {}
