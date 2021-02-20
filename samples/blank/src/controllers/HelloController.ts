import {Controller} from '@sustain/core';
import {Body, Get, Post} from '@sustain/http';

@Controller('/hello')
export class HelloController {
  constructor() {}

  @Get('/say-hello')
  singleUser(): string {
    return `Hello Sustainers`;
  }

  @Post('/say-myname')
  user(@Body('name') name: string) {
    return ` My Name is : ${name}`;
  }
}
