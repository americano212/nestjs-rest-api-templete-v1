import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { LocalRegisterDto } from './dto';

@ApiTags('User')
@Controller()
export class UserController {
  @Post('register')
  public async localRegister(
    @Body() registerData: LocalRegisterDto,
  ): Promise<boolean> {
    console.log(registerData);
    return true;
  }
}
