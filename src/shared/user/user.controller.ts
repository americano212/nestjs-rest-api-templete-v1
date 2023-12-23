import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { LocalRegisterDto, AddRoleToUserDto } from './dto';
import { UserService } from './user.service';
import { User } from './user.interface';

@ApiTags('User')
@Controller()
export class UserController {
  constructor(private readonly user: UserService) {}

  @Post('register')
  public async localRegister(@Body() registerData: LocalRegisterDto): Promise<User> {
    const user = await this.user.create(registerData);
    return user;
  }

  @Post('user/role')
  public async addRoleToUser(@Body() data: AddRoleToUserDto): Promise<boolean> {
    const isSuccess = await this.user.addRole(data);
    return isSuccess;
  }
}
