import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';

import { LocalLoginDto } from './dto';
import { JwtSign } from '.';
// import { AuthService } from 'src/auth/auth.service';

@ApiTags('Auth')
@Controller()
export class AuthController {
  // constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: LocalLoginDto })
  @Post('login')
  public async localLogin(@Body() loginData: LocalLoginDto): Promise<JwtSign> {
    console.log(loginData);
    return { access_token: 'test', refresh_token: 'test' };

    // const jwtSign = await this.authService.localLogin(loginData);
    // return jwtSign;
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
