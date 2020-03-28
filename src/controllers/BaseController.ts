import { Controller } from "../core/di";
import { Get, Response } from "../decorators/http";

import { OpenApi } from "../core/generateOpenApi";


@Controller()
export default class BaseController {
    constructor() { }

    @Get('/swagger.json')
    swaggerJson(@Response() request: any) {
        request.setHeader('Access-Control-Allow-Origin', '*');
        return OpenApi;
    }

}