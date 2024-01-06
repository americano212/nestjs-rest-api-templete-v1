import { PickType } from '@nestjs/swagger';

import { Role } from '#entities/role.entity';

export class CreateRoleDto extends PickType(Role, ['roleName'] as const) {}
