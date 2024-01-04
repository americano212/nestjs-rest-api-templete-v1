import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LocalRegisterDto extends PickType(CreateUserDto, ['username', 'email' as const]) {
  @ApiProperty({ example: 'test!password' })
  @IsString()
  public password!: string;
}
