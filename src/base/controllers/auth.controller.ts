import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';

import { AuthService, JwtSign, LocalLoginGuard, Payload } from '../../auth';
import { LocalLoginDto } from '../dto';
import { ReqUser } from '../../common';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

interface IOAuthUser {
  user: {
    username: string;
    email: string;
    password: string;
  };
}

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

  @Post('login/kakao')
  @UseGuards(AuthGuard('kakao'))
  public async kakaoLogin(@Req() req: Request & IOAuthUser, @Res() res: Response) {
    console.log(req, res);
    this.auth.OAuthLogin();
  }

  @Post('login/naver')
  public async naverLogin() {}
}
