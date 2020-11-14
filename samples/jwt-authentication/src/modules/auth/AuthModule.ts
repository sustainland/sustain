import {JWTInterceptor} from './AuthInterceptor';
import {AuthService} from './AuthService';
import AuthController from './AuthController';
import AccountController from '../users/AccountController';
import {Module} from '@sustain/core';
@Module({
  controllers: [AuthController, AccountController],
  providers: [AuthService, JWTInterceptor],
})
export class AuthModule {}
