import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { UserModule } from '../shared/user';
import {
  LocalStrategy,
  KakaoStrategy,
  NaverStrategy,
  GoogleStrategy,
  GithubStrategy,
  JwtStrategy,
} from './strategies';
import { AuthSerializer } from './auth.serializer';

@Global()
@Module({
  imports: [JwtModule.register({}), UserModule],
  providers: [
    AuthService,
    LocalStrategy,
    GoogleStrategy,
    GithubStrategy,
    KakaoStrategy,
    NaverStrategy,
    JwtStrategy,
    AuthSerializer,
  ],
  exports: [AuthService],
})
export class AuthModule {}
