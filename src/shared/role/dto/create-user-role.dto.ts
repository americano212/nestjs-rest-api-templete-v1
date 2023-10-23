import { UserRole } from '#entities/user-role.entity';

export type CreateUserRoleDto = Pick<UserRole, 'user' | 'role'>;
