import { Get, Post } from "../decorators/http/requests.decorators";
import { Interceptors } from "../decorators/interceptors.decorators";
import { uniqueID } from "../utils/unique-id.util";
// import { getSession, getCookies, setSession } from "../core/sessions";
import { Request, Response, Session } from "../decorators/http/route-params.decorator";
import { Injectable, Inject } from "../core/di";
import { LoggerService } from "../services/logger.service";



@Injectable()
export default class HelloController {
    constructor(private loggerService: LoggerService) {

    }

    @Get('/hello')
    hello() {
            return 'hello';
    }

}