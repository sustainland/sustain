import { Get, Post, Put, Patch, Delete, Head, Options } from "../decorators/http/requests.decorators";
import { Request, Response, Session, Body, Params, Param, Query, Headers, Header } from "../decorators/http/route-params.decorator";
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

    @Put()
    putMethod() {
        return 'Hello Sustain';
    }


    @Patch()
    patchMethod() {
        return 'Hello Sustain';
    }

    @Delete()
    deleteMethod() {
        return 'Hello Sustain';
    }

    @Head()
    headMethod() {
        return 'Hello Sustain';
    }

    @Options()
    optionsMethod() {
        return 'Hello Sustain';
    }

    @Get('/single/:id')
    getMethodAllParams(@Params() params: any) {
        return params.id;
    }
    @Get('/:id/:name')
    getMethodByParamName(@Param('id') id: string, @Param('name') name: string) {
        return `${id}-${name}`
    }

    @Get('/by-query')
    getMethodByQuery(@Query('id') id: string, @Query('name') name: string) {
        return `${id}-${name}`
    }

    @Get('/by-queries')
    getMethodByAllQuery(@Query() query: any) {
        return `${query.id}-${query.name}`
    }

    @Get('/by-headers')
    getMethodHeaders(@Headers() header: any) {
        return header['x-access-token'];
    }
    @Get('/by-header')
    getMethodHeader(@Header('x-access-token') accessToken: any) {
        return accessToken;
    }


    @Post()
    PostBody(@Body() body: string) {
        return body;
    }

    @Post('/byname')
    PostBodyByName(@Body('name') name: string) {
        return name;
    }

    // Sessions

    @Get('/session')
    getSession(@Session() session: any) {
        return session;
    }

    @Post('/session')
    setSession(@Body('id') id: any, @Session() session: any) {
        session.set('id', id);
        return 200;
    }


}