import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { LocalRegisterDto, GiveRoleToUserDto } from './dto';
import { UserService } from './user.service';
import { SuccessResponseDto } from 'src/common/dto';
import { User } from '#entities/index';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly user: UserService) {}

  @Post('register')
  public async localRegister(@Body() localRegisterData: LocalRegisterDto): Promise<User> {
    return await this.user.createLocalUser(localRegisterData);
  }

  @Post('role')
  public async giveRoleToUser(@Body() data: GiveRoleToUserDto): Promise<SuccessResponseDto> {
    return { isSuccess: await this.user.giveRole(data) };
  }
}
