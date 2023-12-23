import { User } from '#entities/user.entity';

export type CreateUserDto = Pick<
  User,
  'username' | 'passwordHash' | 'email' | 'vendor' | 'social_id'
>;
