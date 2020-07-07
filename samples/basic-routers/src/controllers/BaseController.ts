import { Response, Get } from '@sustain/common/http';
import { Controller } from '@sustain/core';
import { getOpenApi } from '@sustain/common';


@Controller()
export default class BaseController {
    constructor() { }

    @Get('/swagger.json')
    swaggerJson(@Response() request: any) {
        request.setHeader('Access-Control-Allow-Origin', '*');
        return getOpenApi();
    }

}