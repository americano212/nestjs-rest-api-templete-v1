import { User } from '#entities/user.entity';

export type LocalLoginDto = Pick<User, 'username' | 'passwordHash'>;
