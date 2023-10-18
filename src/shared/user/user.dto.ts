import { User } from '#entities/user.entity';

export type UserDto = Pick<User, 'user_id' | 'username' | 'email'>;
