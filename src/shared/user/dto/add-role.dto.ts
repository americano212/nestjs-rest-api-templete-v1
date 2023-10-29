import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class addRoleDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  public user_id!: number;

  @ApiProperty({ example: 'TestRole' })
  @IsString()
  public role_name!: string;
}
