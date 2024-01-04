import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { LocalRegisterDto, AddRoleToUserDto } from './dto';
import { UserService } from './user.service';
import { User } from './user.interface';
import { SuccessResponseDto } from 'src/common/dto';

@ApiTags('User')
@Controller()
export class UserController {
  constructor(private readonly user: UserService) {}

  @Post('register')
  public async localRegister(@Body() registerData: LocalRegisterDto): Promise<User> {
    return await this.user.create(registerData);
  }

  @Post('user/role')
  public async addRoleToUser(@Body() data: AddRoleToUserDto): Promise<SuccessResponseDto> {
    return { isSuccess: await this.user.addRole(data) };
  }
}
