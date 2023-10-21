import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LocalLoginDto {
  @ApiProperty({ example: '홍길동' })
  @IsString()
  public username!: string;

  @ApiProperty({ example: 'test!password' })
  @IsString()
  public password!: string;
}
