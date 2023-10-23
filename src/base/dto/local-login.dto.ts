import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LocalLoginDto {
  @ApiProperty({ example: 'test@example.com' })
  @IsString()
  public email!: string;

  @ApiProperty({ example: 'test!password' })
  @IsString()
  public password!: string;
}
