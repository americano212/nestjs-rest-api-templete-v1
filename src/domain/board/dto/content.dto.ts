import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { User as UserEntity } from '#entities/user.entity';
import { Board as BoardEntity } from '#entities/board';
import { CreateContentDto } from './create-content.dto';

export class ContentDto extends CreateContentDto {
  @ApiProperty({ example: 'Author Name' })
  @IsString()
  @IsOptional()
  public author?: string | null;

  @ApiProperty({ example: '127.0.0.1' })
  @IsString()
  @IsOptional()
  public ip?: string | null;

  @ApiProperty({ type: () => UserEntity })
  @IsOptional()
  user?: UserEntity | null;

  @ApiProperty({ type: () => BoardEntity })
  @IsOptional()
  board?: BoardEntity | null;
}
