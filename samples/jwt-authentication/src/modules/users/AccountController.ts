import {JWTInterceptor} from '../auth/AuthInterceptor';

import {Controller} from '@sustain/core';
import {Get} from '@sustain/http';

@Controller('/account', {
  interceptors: [JWTInterceptor],
})
export default class AccountController {
  constructor() {}
  @Get('/me')
  me(): any {
    return {};
  }
}
