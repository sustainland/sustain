import { Get, Post } from "../decorators/http/requests.decorators";
import { Request, Response, Session, Body, Params, Param } from "../decorators/http/route-params.decorator";
import { Injectable, Inject, Controller } from "../core/di";
import { LoggerService } from "../services/logger.service";



@Controller('/http-controller')
export default class HttpController {
    constructor() {

    }

    @Get()
    getMethod() {
        return 'Hello Sustain';
    }


    @Get('/:id')
    getMethodAllParams(@Params() params: any) {
        return params.id;
    }
    @Get('/:id/:name')
    getMethodByParamName(@Param('id') id: string, @Param('name') name: string) {
        return `${id}-${name}`
    }
    @Post()
    PostBody(@Body() body: string) {
        console.log("HttpController -> PostBodyMethod -> body", body)
        return body;
    }

    @Post('/byname')
    PostBodyByName(@Body('name') name: string) {
        return name;
    }

}