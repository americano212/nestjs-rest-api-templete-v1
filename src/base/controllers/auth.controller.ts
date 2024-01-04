import { Controller, Get, Post, Redirect, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';

import { AuthService, JwtSign, LocalLoginGuard, Payload } from '../../auth';
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
    return await this.auth.jwtSign(user);
  }

  @Get('logout')
  @Redirect('/')
  public async localLogout(): Promise<void> {}
}
