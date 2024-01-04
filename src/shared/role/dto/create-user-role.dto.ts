import { UserRole } from '#entities/user-role.entity';
import { PickType } from '@nestjs/mapped-types';

export class CreateUserRoleDto extends PickType(UserRole, ['user', 'role', 'role_name' as const]) {}
