import { Controller } from '@sustain/core';
import { Get, Session, Post, Body, Patch, Put, Delete, Param, Head, Options } from '@sustain/common';


import { UserDto } from "../dto/HelloDto";



@Controller()
export default class HelloController {
    constructor() { }

    @Get('/hello')
    hello(@Session() session: any) {
        return session;
    }
    @Post('/byebye')
    byebye(@Body() user: UserDto) {
        return "value" + user.name;
    }

}