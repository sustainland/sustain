import { Get, Post } from "../decorators/http/requests.decorators";
import { Session, Body } from "../decorators/http/route-params.decorator";
import { Controller } from "../core/di";



@Controller()
export default class HelloController {
    constructor() { }

    @Get('/hello')
    hello(@Session() session: any) {
        return session;
    }
    @Post('/byebye')
    byebye(@Body('yes') yes: number) {
        return "value" + yes;
    }

}