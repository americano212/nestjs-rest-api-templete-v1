import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';

import { Payload, LocalLoginGuard } from '../../auth';
import { LocalLoginDto } from '../dto';
import { ReqUser } from '../../common';

@ApiTags('Auth')
@Controller()
export class AuthController {
  @ApiBody({ type: LocalLoginDto })
  @Post('login')
  @UseGuards(LocalLoginGuard)
  public async localLogin(@ReqUser() user: Payload): Promise<Payload> {
    return user;
  }

  @Get('logout')
  public async localLogout() {}

  @Post('register')
  public async localRegister() {}

  // OAuth Login Controller
  @Post('login/google')
  public async googleLogin() {}

  @Post('login/github')
  public async githubLogin() {}

  @Post('login/kakao')
  public async kakaoLogin() {}

  @Post('login/naver')
  public async naverLogin() {}
}
