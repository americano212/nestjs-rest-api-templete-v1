import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateBoardDto {
  @ApiProperty({ example: 'Test Board' })
  @IsString()
  public board_name!: string;

  @ApiProperty({ example: ['TestRole', 'User'] })
  @IsString()
  public board_read_roles!: string[];

  @ApiProperty({ example: ['TestRole'] })
  @IsString()
  public board_write_roles!: string[];
}
