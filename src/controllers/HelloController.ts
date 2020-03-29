import { Get, Post } from "../decorators/http/requests.decorators";
import { Session, Body } from "../decorators/http/route-params.decorator";
import { Controller } from "../core/di";
import { UserDto } from "../dto/HelloDto";



@Controller()
export default class HelloController {
    constructor() { }

    @Get('/hello')
    hello(@Session() session: any) {
        return session;
    }
    @Post('/byebye')
    byebye(@Body('user') user: UserDto) {
        return "value" + user.name;
    }

}