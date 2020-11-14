import {JWTInterceptor} from '../auth/AuthInterceptor';
// interceptors: [
//     PlayerInterceptors //  added here
// ]

import {Controller} from '@sustain/core';
import {Get} from '@sustain/common';

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
