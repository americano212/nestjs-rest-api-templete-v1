import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { BoardGuardType } from '../enums';

export const TYPE_KEY = 'board-guard';
export const BoardRole = (types: BoardGuardType): CustomDecorator => SetMetadata(TYPE_KEY, types);
