import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateContentDto {
  @ApiProperty({ example: 'Test Title' })
  @IsString()
  @IsNotEmpty()
  public title!: string;

  @ApiProperty({ example: 'Test Content' })
  @IsString()
  @IsNotEmpty()
  public content!: string;
}
