import { Controller } from "../core/di";
import { Get, Response } from "../decorators/http";
import { readFileSync } from "fs";
import { join } from "path";



@Controller()
export default class BaseController {
    constructor() {}
    @Get('/favicon.ico')
    favicon(@Response() res:any){
        res.writeHead(200, {'Content-Type': 'image/x-icon'});
        res.end(readFileSync(join(__dirname,'../views/favicon.ico')));
    }

}