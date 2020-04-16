import { Get, Post } from "../../packages/common/decorators/http/requests.decorators";
import { Session, Body } from "../../packages/common/decorators/http/route-params.decorator";
import { Controller } from "../../packages/core/di";
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