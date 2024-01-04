import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import {
  AuthService,
  GithubLoginGuard,
  GoogleLoginGuard,
  JwtSign,
  KakaoLoginGuard,
  NaverLoginGuard,
  Payload,
} from '../../auth';
import { ReqUser } from '../../common';

@ApiTags('Auth')
@Controller('login')
export class OAuthController {
  constructor(private readonly auth: AuthService) {}

  @Get('/google')
  @UseGuards(GoogleLoginGuard)
  public async googleLogin(): Promise<void> {}

  @Get('/google/callback')
  @UseGuards(GoogleLoginGuard)
  public async googleLoginCallback(@ReqUser() user: Payload): Promise<JwtSign> {
    return await this.auth.jwtSign(user);
  }

  @Get('/github')
  @UseGuards(GithubLoginGuard)
  public async githubLogin(): Promise<void> {}

  @Get('/github/callback')
  @UseGuards(GithubLoginGuard)
  public async githubLoginCallback(@ReqUser() user: Payload): Promise<JwtSign> {
    return await this.auth.jwtSign(user);
  }

  @Get('/kakao')
  @UseGuards(KakaoLoginGuard)
  public async kakaoLogin(): Promise<void> {}

  @Get('/kakao/callback')
  @UseGuards(KakaoLoginGuard)
  public async kakaoLoginCallBack(@ReqUser() user: Payload): Promise<JwtSign> {
    return await this.auth.jwtSign(user);
  }

  @Get('/naver')
  @UseGuards(NaverLoginGuard)
  public async naverLogin(): Promise<void> {}

  @Get('/naver/callback')
  @UseGuards(NaverLoginGuard)
  public async naverLoginCallBack(@ReqUser() user: Payload): Promise<JwtSign> {
    return await this.auth.jwtSign(user);
  }
}
