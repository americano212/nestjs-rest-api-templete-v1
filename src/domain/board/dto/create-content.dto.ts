import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateContentDto {
  @ApiProperty({ example: 'Content Title' })
  @IsString()
  public title!: string;

  @ApiProperty({ example: 'Content Content Content' })
  @IsString()
  public content!: string;
}
