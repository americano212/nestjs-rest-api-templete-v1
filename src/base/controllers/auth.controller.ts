import { Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
// import { AuthService } from 'src/auth/auth.service';

@ApiTags('Auth')
@Controller()
export class AuthController {
  @Post('login')
  public localLogin() {}

  @Get('logout')
  public localLogout() {}

  @Post('register')
  public localRegister() {}

  // OAuth Login Controller
  @Post('login/google')
  public googleLogin() {}

  @Post('login/github')
  public githubLogin() {}

  @Post('login/kakao')
  public kakaoLogin() {}

  @Post('login/naver')
  public naverLogin() {}
}
