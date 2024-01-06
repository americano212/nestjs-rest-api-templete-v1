import { PickType } from '@nestjs/swagger';
import { ContentDto } from './content.dto';

export class CreateContentDto extends PickType(ContentDto, ['title', 'content'] as const) {}
