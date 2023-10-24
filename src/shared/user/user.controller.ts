import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { LocalRegisterDto } from './dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller()
export class UserController {
  constructor(private readonly user: UserService) {}

  @Post('register')
  public async localRegister(
    @Body() registerData: LocalRegisterDto,
  ): Promise<boolean> {
    console.log(registerData);
    const isSuccess = this.user.create(registerData);

    return isSuccess;
  }
}
