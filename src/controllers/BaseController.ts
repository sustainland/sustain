import { Controller } from "../../packages/core/di";
import { Get, Response } from "../../packages/common/decorators/http";

import { OpenApi } from "../../packages/common/extensions/swagger/generateOpenApi";


@Controller()
export default class BaseController {
    constructor() { }

    @Get('/swagger.json')
    swaggerJson(@Response() request: any) {
        request.setHeader('Access-Control-Allow-Origin', '*');
        return OpenApi;
    }

}