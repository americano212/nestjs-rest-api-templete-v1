import { Board } from '#entities/board';
import { PickType } from '@nestjs/swagger';

export class CreateBoardDto extends PickType(Board, [
  'boardName',
  'boardReadRoles',
  'boardWriteRoles',
] as const) {}
