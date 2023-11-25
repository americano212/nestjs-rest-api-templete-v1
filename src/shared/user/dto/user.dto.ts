import { User } from '#entities/user.entity';

export type UserDto = Pick<
  User,
  'user_id' | 'username' | 'passwordHash' | 'email' | 'roles' | 'vendor' | 'social_id'
>;
