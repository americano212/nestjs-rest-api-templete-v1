import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateBoardDto {
  @ApiProperty({ example: 'Admin Board' })
  @IsString()
  public board_name!: string;

  @ApiProperty({ example: ['SuperAdmin'] })
  @IsString()
  public board_read_roles!: string[];

  @ApiProperty({ example: ['SuperAdmin'] })
  @IsString()
  public board_write_roles!: string[];
}
