import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { AuthService, JwtSign, KakaoLoginGuard, LocalLoginGuard, Payload } from '../../auth';
import { LocalLoginDto } from '../dto';
import { ReqUser } from '../../common';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @ApiBody({ type: LocalLoginDto })
  @Post('login')
  @UseGuards(LocalLoginGuard)
  public async localLogin(@ReqUser() user: Payload): Promise<JwtSign> {
    return this.auth.jwtSign(user);
  }

  @Get('logout')
  public localLogout(@Req() req: Request, @Res() res: Response): void {
    req.logout(() => {
      res.redirect('/');
    });
  }

  // OAuth Login Controller
  @Post('login/google')
  public async googleLogin() {}

  @Post('login/github')
  public async githubLogin() {}

  @Get('login/kakao')
  @UseGuards(KakaoLoginGuard)
  public async kakaoLogin(@ReqUser() user: Payload, @Res() res: Response) {
    console.log('user : ', user);
    this.auth.jwtSign(user);
    res.redirect('/');
  }

  @Post('login/naver')
  public async naverLogin() {}
}
