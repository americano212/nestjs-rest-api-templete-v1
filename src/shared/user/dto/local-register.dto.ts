import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class LocalRegisterDto extends PickType(CreateUserDto, ['username', 'email'] as const) {
  @ApiProperty({ example: 'test!password' })
  @IsString()
  public password!: string;
}
