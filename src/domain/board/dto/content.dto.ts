import { PickType } from '@nestjs/swagger';

import { Content } from '#entities/board';

export class ContentDto extends PickType(Content, [
  'title',
  'content',
  'author',
  'ip',
  'user',
  'board',
]) {}
