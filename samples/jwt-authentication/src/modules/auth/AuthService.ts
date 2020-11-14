import {JWT_ALGORITHM} from './constants';
import {Injectable} from '@sustain/core';
const {jwt_config} = require('@sustain/config');
const jwt = require('jsonwebtoken');

@Injectable()
export class AuthService {
  adminAccount = {
    // for demo purpose
    username: 'admin',
    password: 'admin',
  };
  payload: any = {};
  constructor() {}

  login(username: string, password: string): boolean {
    if (username === this.adminAccount.username && password === this.adminAccount.password) {
      this.payload = {username};
      return true;
    }
    return false;
  }

  generateToken(): string {
    return jwt.sign(this.payload, jwt_config.ACCESS_TOKEN_SECRET, {
      algorithm: JWT_ALGORITHM,
      expiresIn: jwt_config.ACCESS_TOKEN_LIFE,
    });
  }
  verify(accessToken: string): any {
    return jwt.verify(accessToken, jwt_config.ACCESS_TOKEN_SECRET);
  }
  logout() {}
}
