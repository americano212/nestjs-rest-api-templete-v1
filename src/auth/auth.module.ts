import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserModule } from '../shared/user';
import { AuthController } from './auth.controller';
// https://www.elvisduru.com/blog/nestjs-jwt-authentication-refresh-token

@Global()
@Module({
  imports: [JwtModule.register({}), UserModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
