import { User } from '#entities/user.entity';

export type CreateUserDto = Pick<
  User,
  'username' | 'passwordHash' | 'email' | 'roles' | 'vendor' | 'social_id'
>;
