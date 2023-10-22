import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';

import { Payload, LocalLoginGuard } from '../../auth';
import { LocalLoginDto, LocalRegisterDto } from '../dto';
import { ReqUser } from '../../common';
import { Request, Response } from 'express';

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
  public localLogout(@Req() req: Request, @Res() res: Response): void {
    req.logout(() => {
      res.redirect('/');
    });
  }

  @Post('register')
  public async localRegister(
    @Body() registerData: LocalRegisterDto,
  ): Promise<boolean> {
    console.log(registerData);
    return true;
  }

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
