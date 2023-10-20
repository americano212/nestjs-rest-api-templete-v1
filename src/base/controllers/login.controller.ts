import { Controller, Post } from '@nestjs/common';
// import { AuthService } from 'src/auth/auth.service';

@Controller('login')
export class LoginController {
  //   constructor(private auth: AuthService) {}

  @Post('local')
  public localLogin() {}

  // OAuth Login Controller
  @Post('google')
  public googleLogin() {}

  @Post('github')
  public githubLogin() {}

  @Post('kakao')
  public kakaoLogin() {}

  @Post('naver')
  public naverLogin() {}
}
