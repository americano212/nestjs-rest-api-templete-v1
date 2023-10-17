import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserModule } from '../shared/user';
// https://www.elvisduru.com/blog/nestjs-jwt-authentication-refresh-token
@Global()
@Module({
  imports: [JwtModule.register({}), UserModule],
  providers: [AuthService],
})
export class AuthModule {}
