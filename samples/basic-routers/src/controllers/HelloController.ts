import { Controller } from '@sustain/core';
import { Get, Session, Post, Body } from '@sustain/common';


import { UserDto } from "../dto/UserDto";



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