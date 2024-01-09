import { UploadFile } from '#entities/file';
import { PickType } from '@nestjs/swagger';

export class UploadFileDto extends PickType(UploadFile, [
  'originalName',
  'url',
  'size',
  'encoding',
  'mimeType',
] as const) {}
