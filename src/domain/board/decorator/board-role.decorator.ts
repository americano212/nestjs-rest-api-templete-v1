import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { BoardGuardType } from '../enums';

export const BOARD_GUARD_KEY = 'board-guard';
export const BoardRole = (types: BoardGuardType): CustomDecorator =>
  SetMetadata(BOARD_GUARD_KEY, types);
