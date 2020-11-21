import {AuthService} from './AuthService';
import {Controller} from '@sustain/core';
import {Body, Get, Post, Response} from '@sustain/http';
import {ServerResponse} from 'http';

@Controller('/auth')
export default class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  login(
    @Body('username') username: string,
    @Body('password') password: string,
    @Response() response: ServerResponse
  ): any {
    if (this.authService.login(username, password)) {
      return this.authService.generateToken();
    } else {
      response.statusCode = 401;
      return 'unauthorized';
    }
  }

  @Post('/logout')
  logout(): any {}
}
