import {
    Controller
} from '@sustain/core';
import {
    Body,
    Get,
    Post
} from '@sustain/common';
import { HelloService } from "../services/hello.service";

@Controller('/hello')
export default class HelloController {
    constructor(private helloService: HelloService) { }

    @Get('/sayHello')
    singleUser(): string {
        return `Hello Sustainers`;

    }

    @Post('/say-myname')
    user(@Body('name') name: string) {
        return ` My Name is : ${name}`;
    }
}