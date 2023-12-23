import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddRoleDto {
  @ApiProperty({ example: 'TestRole' })
  @IsString()
  public role_name!: string;
}
