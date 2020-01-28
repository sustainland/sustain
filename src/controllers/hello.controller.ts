import { Get, Post } from "../decorators/http/requests.decorators";
import { Interceptors } from "../decorators/interceptors.decorators";
import { isAuthenticated, validateParams } from "../auth";
import { uniqueID } from "../utils/unique-id.util";
import { getSession, getCookies, setSession } from "../core/sessions";
import { Request, Response } from "../decorators/http/route-params.decorator";


export default class HelloController {
    constructor() {
    }
    @Get('/user/:id')
    GetUsers(
        @Response() res: any,
        @Request() resquest: any,
        @Request() resquest2: any,
        @Response() res2: any
    ) {
        const id = resquest2.params.id;

        // reponce using Respense
        res2.end(`
            user id : ${id}
        `);

        // text reponce
        // return `
        //     a text from @get
        // `;

        // promise reponce
        // return new Promise((resolve) => {
        //     setTimeout(()=>{
        //         resolve(' Ok from promise after 5sec')
        //     },5000)
        // })
    }

    @Get('/user/:id/:name/profile')
    @Interceptors([
        isAuthenticated,
        validateParams
    ])
    GetUsersWithName(@Request() req: any, @Response() res: any) {
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