import { Controller, Get, Post, Redirect, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';

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
  @Redirect('/')
  public async localLogout(): Promise<void> {}

  // OAuth Login Controller
  @Get('login/google')
  @UseGuards(GoogleLoginGuard)
  public async googleLogin(): Promise<void> {}

  @Get('login/google/callback')
  @UseGuards(GoogleLoginGuard)
  public async googleLoginCallback(@ReqUser() user: Payload): Promise<JwtSign> {
    return await this.auth.jwtSign(user);
  }

  @Get('login/github')
  @UseGuards(GithubLoginGuard)
  public async githubLogin(): Promise<void> {}

  @Get('login/github/callback')
  @UseGuards(GithubLoginGuard)
  public async githubLoginCallback(@ReqUser() user: Payload): Promise<JwtSign> {
    return await this.auth.jwtSign(user);
  }

  @Get('login/kakao')
  @UseGuards(KakaoLoginGuard)
  public async kakaoLogin(): Promise<void> {}

  @Get('login/kakao/callback')
  @UseGuards(KakaoLoginGuard)
  public async kakaoLoginCallBack(@ReqUser() user: Payload): Promise<JwtSign> {
    return await this.auth.jwtSign(user);
  }

  @Get('login/naver')
  @UseGuards(NaverLoginGuard)
  public async naverLogin(): Promise<void> {}

  @Get('login/naver/callback')
  @UseGuards(NaverLoginGuard)
  public async naverLoginCallBack(@ReqUser() user: Payload): Promise<JwtSign> {
    return await this.auth.jwtSign(user);
  }
}
