import { Get, Post } from "../decorators/http/requests.decorators";
import { Request} from "../decorators/http/route-params.decorator";
import { Injectable } from "../core/di";
import { UserService } from "../services/user.service";



@Injectable()
export default class UserController {
    constructor(private userService: UserService) { }

    @Get('/users')
    users() {
        return this.userService.list();

    }

    @Get('/user/:id')
    user(@Request() request: any) {
        const { id } = request.params
        return this.userService.get(id);

    }

    @Get('/user/:id/details')
    userDetails(@Request() request: any) {
        const { id } = request.params
        return this.userService.syncGet(id);

    }

}