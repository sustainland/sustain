import { Get, Post } from "../decorators/http/requests.decorators";
import { Interceptors } from "../decorators/interceptors.decorators";
import { isAuthenticated, validateParams } from "../auth";
import { uniqueID } from "../utils/unique-id.util";
import { getSession, getCookies, setSession } from "../core/sessions";


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
        const ids = getCookies(req)['ids'];
        let userNameFromSession;
        if (!getSession(ids)) {
            const ids = uniqueID();
            res.setHeader('Set-Cookie', ['ids=' + ids]);
            setSession(ids, { username: 'username from session' })
        } else {
            console.log(getSession(ids))
            userNameFromSession = getSession(ids).username
        }
        const { id, name } = req.params;
        res.end(`
            user id : ${id}
            user name : ${name}
            user name  from session: ${userNameFromSession}
        `);
    }
    @Post('/users.json')
    GetUsersJSON(req: any, res: any) {
        res.end('{ name : "user 1"}');
    }
}