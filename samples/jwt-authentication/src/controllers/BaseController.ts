import {Get} from '@sustain/http';
import {Controller} from '@sustain/core';

@Controller()
export default class BaseController {
  constructor() {}

  @Get()
  home(): any {
    return {message: 'welcome sustainers', version: 'beta'};
  }
}
