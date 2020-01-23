import { Get, Post } from "../decorators/http/requests.decorators";


export default class HelloController {
    constructor() {
    }
    @Get('/users')
    GetUsers(req: any, res: any) {
        res.end('users');
    }

    @Post('/users.json')
    GetUsersJSON(req: any, res: any) {
        res.end('{ name : "user 1"}');
    }
}