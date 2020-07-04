import { Controller } from '@sustain/core';
import { Get, Session, Post, Body } from '@sustain/common';


import { PlayerDto } from "../dto/PlayerDto";



@Controller()
export default class HelloController {
    constructor() { }

    @Get('/hello')
    hello(@Session() session: any) {
        return session;
    }
    @Post('/byebye')
    byebye(@Body() user: PlayerDto) {
        return "value" + user.name;
    }

}