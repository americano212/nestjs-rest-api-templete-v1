import { PickType } from '@nestjs/swagger';

import { UserRole } from '#entities/user-role.entity';

export class CreateUserRoleDto extends PickType(UserRole, ['user', 'role', 'role_name'] as const) {}
