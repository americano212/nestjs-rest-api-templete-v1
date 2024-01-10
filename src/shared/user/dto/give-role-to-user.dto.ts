import { IntersectionType, PickType } from '@nestjs/swagger';

import { User } from '#entities/index';
import { UserRole } from '#entities/user-role.entity';

export class GiveRoleToUserDto extends IntersectionType(
  PickType(UserRole, ['roleName'] as const),
  PickType(User, ['userId'] as const),
) {}
