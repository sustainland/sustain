import { Query, Headers, Body,  Header } from '@sustain/common';
import { ApiConsumes, ApiTags } from '@sustain/common';
import { ApiProduces } from '@sustain/common';
import { ApiResponse } from '@sustain/common';
import { Controller } from '@sustain/core';
import { Get,  Session,Post,  Patch, Put, Delete, Param, Head, Options, Params } from '@sustain/common';;

import { UserDto } from "../dto/UserDto";


@ApiTags('Http-Controller')
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

    @ApiResponse([
        { status: 200, description: "OK" },
        { status: 201, description: "Created" }
    ])
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


    @ApiConsumes([
        "application/json",
        "application/xml"
    ])
    @ApiProduces([
        "application/json",
        "application/xml"
    ])
    @Post()
    PostBody(@Body() body: UserDto) {
        return body;
    }

    @Post('/byname')
    PostBodyByName(@Body('name') name: string) {
        return name;
    }

    @Get('/session')
    getSession(@Session() session: any) {
        return session.id;
    }

    @Post('/session')
    setSession(@Body('id') id: any, @Session() session: any) {
        session.id = id;
        return session.id;
    }


}