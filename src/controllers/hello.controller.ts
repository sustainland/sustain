import { Get, Post } from "../decorators/http/requests.decorators";
import { Interceptors } from "../decorators/interceptors.decorators";
import { isAuthenticated, validateParams } from "../auth";


export default class HelloController {
    constructor() {
    }
    @Get('/user/:id')
    GetUsers(req: any, res: any) {
        const id = req.params.id;
        res.end(`
            user id : ${id}
        `);
    }

    @Get('/user/:id/:name/profile')
    @Interceptors([
        isAuthenticated,
        validateParams
    ])
    GetUsersWithName(req: any, res: any) {
        const id = req.params.id;
        const name = req.params.name;
        res.end(`
            user id : ${id}
            user name : ${name}
        `);
    }
    @Post('/users.json')
    GetUsersJSON(req: any, res: any) {
        res.end('{ name : "user 1"}');
    }
}