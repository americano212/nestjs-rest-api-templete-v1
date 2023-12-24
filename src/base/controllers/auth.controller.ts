import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

import {
  AuthService,
  GoogleLoginGuard,
  JwtSign,
  KakaoLoginGuard,
  LocalLoginGuard,
  NaverLoginGuard,
  Payload,
} from '../../auth';
import { LocalLoginDto } from '../dto';
import { ReqUser } from '../../common';
import { GithubLoginGuard } from 'src/auth/guards/github-login.guard';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @ApiBody({ type: LocalLoginDto })
  @Post('login')
  @UseGuards(LocalLoginGuard)
  public async localLogin(@ReqUser() user: Payload): Promise<JwtSign> {
    return await this.auth.jwtSign(user);
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
  public async googleLoginCallback(@ReqUser() user: Payload): Promise<JwtSign> {
    return await this.auth.jwtSign(user);
  }

  @Get('login/github')
  @UseGuards(GithubLoginGuard)
  public async githubLogin() {}

  @Get('login/github/callback')
  @UseGuards(GithubLoginGuard)
  public async githubLoginCallback(@ReqUser() user: Payload): Promise<JwtSign> {
    return await this.auth.jwtSign(user);
  }

  @Get('login/kakao')
  @UseGuards(KakaoLoginGuard)
  public async kakaoLogin() {}

  @Get('login/kakao/callback')
  @UseGuards(KakaoLoginGuard)
  public async kakaoLoginCallBack(@ReqUser() user: Payload): Promise<JwtSign> {
    return await this.auth.jwtSign(user);
  }

  @Get('login/naver')
  @UseGuards(NaverLoginGuard)
  public async naverLogin() {}

  @Get('login/naver/callback')
  @UseGuards(NaverLoginGuard)
  public async naverLoginCallBack(@ReqUser() user: Payload): Promise<JwtSign> {
    return await this.auth.jwtSign(user);
  }
}
