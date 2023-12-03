import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

import {
  AuthService,
  GoogleLoginGuard,
  KakaoLoginGuard,
  LocalLoginGuard,
  NaverLoginGuard,
  Payload,
} from '../../auth';
import { LocalLoginDto } from '../dto';
import { ReqUser } from '../../common';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @ApiBody({ type: LocalLoginDto })
  @Post('login')
  @UseGuards(LocalLoginGuard)
  public async localLogin(@ReqUser() user: Payload, @Res() res: Response): Promise<void> {
    const { access_token, refresh_token } = await this.auth.jwtSign(user);
    res.cookie('access_token', access_token, { httpOnly: true });
    res.cookie('refresh_token', refresh_token, { httpOnly: true });
    res.send({ access_token, refresh_token });
  }

  @Get('logout')
  public localLogout(@Req() req: Request, @Res() res: Response): void {
    req.logout(() => {
      res.redirect('/');
    });
  }

  // OAuth Login Controller
  @Get('login/google')
  @UseGuards(GoogleLoginGuard)
  public async googleLogin() {}

  @Get('login/google/callback')
  @UseGuards(GoogleLoginGuard)
  public async googleLoginCallback(@ReqUser() user: Payload, @Res() res: Response): Promise<void> {
    //const { access_token, refresh_token } = await this.auth.jwtSign(user);
    //res.cookie('access_token', access_token, { httpOnly: true });
    //res.cookie('refresh_token', refresh_token, { httpOnly: true });
    console.log('google.co', user);
    res.redirect('/');
  }

  @Get('login/github')
  public async githubLogin() {}

  @Get('login/kakao')
  @UseGuards(KakaoLoginGuard)
  public async kakaoLogin() {}

  @Get('login/kakao/callback')
  @UseGuards(KakaoLoginGuard)
  public async kakaoLoginCallBack(@ReqUser() user: Payload, @Res() res: Response): Promise<void> {
    const { access_token, refresh_token } = await this.auth.jwtSign(user);
    res.cookie('access_token', access_token, { httpOnly: true });
    res.cookie('refresh_token', refresh_token, { httpOnly: true });
    res.redirect('/');
  }

  @Get('login/naver')
  @UseGuards(NaverLoginGuard)
  public async naverLogin() {}

  @Get('login/naver/callback')
  @UseGuards(NaverLoginGuard)
  public async naverLoginCallBack(@ReqUser() user: Payload, @Res() res: Response): Promise<void> {
    const { access_token, refresh_token } = await this.auth.jwtSign(user);
    res.cookie('access_token', access_token, { httpOnly: true });
    res.cookie('refresh_token', refresh_token, { httpOnly: true });
    res.redirect('/');
  }
}
