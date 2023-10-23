import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LocalRegisterDto {
  @ApiProperty({ example: '홍길동' })
  @IsString()
  public username!: string;

  @ApiProperty({ example: 'test!password' })
  @IsString()
  public password!: string;

  @ApiProperty({ example: 'test@example.com' })
  @IsEmail()
  public email!: string;

  @ApiProperty({ example: ['User'] })
  @IsString({ each: true })
  public roles!: string[];

  constructor() {
    this.roles = ['User'];
  }
}
