import { Controller } from "../core/di";
import { Get, Response, Request } from "../decorators/http";
import { readFileSync } from "fs";
import { join } from "path";

import { OpenApi } from "../core/generateOpenApi";


@Controller()
export default class BaseController {
    constructor() { }
    @Get('/favicon.ico')
    favicon(@Response() res: any) {
        res.writeHead(200, { 'Content-Type': 'image/x-icon' });
        res.end(readFileSync(join(__dirname, '../views/favicon.ico')));
    }

    @Get('/swagger.json')
    swaggerJson(@Response() request: any) {
        request.setHeader('Access-Control-Allow-Origin', '*');
        return OpenApi;
    }

}