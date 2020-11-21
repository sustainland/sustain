import 'reflect-metadata';
import {Response, Get} from '@sustain/http';
import {Controller} from '@sustain/core';
import {getOpenApi} from './generateOpenApi';

@Controller()
export class SwaggerddController {
  constructor() {}

  @Get('/swagger.json')
  swaggerJson(@Response() request: any) {
    request.setHeader('Access-Control-Allow-Origin', '*');
    return getOpenApi();
  }

  @Get()
  home(): any {
    return {message: 'welcome sustainers', version: 'beta'};
  }
}
