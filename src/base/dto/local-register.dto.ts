import { ApiProperty } from '@nestjs/swagger';
import { LocalLoginDto } from './local-login.dto';
import { IsString } from 'class-validator';

export class LocalRegisterDto extends LocalLoginDto {
  @ApiProperty({ example: 'test@example.com' })
  @IsString()
  public email!: string;
}
