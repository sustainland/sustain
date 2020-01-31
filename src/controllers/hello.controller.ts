import { Get, Post } from "../decorators/http/requests.decorators";
import { Interceptors } from "../decorators/interceptors.decorators";
import { isAuthenticated, validateParams } from "../auth";
import { uniqueID } from "../utils/unique-id.util";
// import { getSession, getCookies, setSession } from "../core/sessions";
import { Request, Response, Session } from "../decorators/http/route-params.decorator";
import { Injectable, Inject } from "../core/di";
import { LoggerService } from "../services/logger.service";



@Injectable()
export default class HelloController {
    constructor(private loggerService: LoggerService) {

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
    GetUsersWithName(@Request() req: any, @Response() res: any, @Session() session: any) {
       
        let { username } = session;

        const { id, name } = req.params;
        res.end(`
            user id : ${id}
            user name : ${name}
            user name  from session: ${username}
        `);
    }
    @Post('/users.json')
    GetUsersJSON(req: any, res: any) {
        res.end('{ name : "user 1"}');
    }
}