import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { OwnerGuardType } from '../enums';

export const OWNER_GUARD_KEY = 'owner-guard';
export const Owner = (types: OwnerGuardType): CustomDecorator =>
  SetMetadata(OWNER_GUARD_KEY, types);
