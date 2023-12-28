import { UserRole } from '#entities/user-role.entity';

export interface User {
  user_id: number;
  username?: string | undefined;
  passwordHash?: string;
  email?: string;
  vendor?: string;
  social_id?: string;
  roles?: string[] | UserRole[];
}

export interface SNSUser {
  username: string;
  email: string;
  social_id: string;
  vendor: string;
}
