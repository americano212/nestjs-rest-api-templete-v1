import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
// https://www.elvisduru.com/blog/nestjs-jwt-authentication-refresh-token
@Global()
@Module({
  imports: [JwtModule.register({})],
  providers: [AuthService],
})
export class AuthModule {}
