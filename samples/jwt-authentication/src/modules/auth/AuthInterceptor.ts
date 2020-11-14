import {AuthService} from './AuthService';
import {Response, Next, Headers} from '@sustain/common';
import {Injectable, SustainInterceptor} from '@sustain/core';
import {Server, ServerResponse} from 'http';
const {jwt_config} = require('@sustain/config');
const jwt = require('jsonwebtoken');

@Injectable()
export class JWTInterceptor implements SustainInterceptor {
  constructor(public authService: AuthService) {}
  /**
   * @description using decorators in interceptors, passing to next interceptor or route handler function with @Next
   * we can use all params route decorators like : @Response, @Request, @Session, @Params, @Files ....
   */
  intercept(@Next() next: any, @Response() response: ServerResponse, @Headers() header: any) {
    const {'x-api-key': apiKey} = header;
    if (!apiKey) {
      response.end(`You are not authorized to execute this request`);
    } else {
      try {
        jwt.verify(apiKey, jwt_config.ACCESS_TOKEN_SECRET);
        next();
      } catch (error) {
        console.log(error);
        response.statusCode = 401;
        response.end(`Invalid accessToken`);
      }
    }
    // TODO : refactor after fix this is undefined
  }
}
