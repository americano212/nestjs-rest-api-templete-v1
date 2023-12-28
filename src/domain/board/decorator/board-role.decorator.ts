import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { GuardType } from '../enums';

export const TYPE_KEY = 'board-guard';
export const BoardRole = (types: GuardType): CustomDecorator => SetMetadata(TYPE_KEY, types);
