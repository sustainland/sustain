import { Next, Response, Headers } from "./decorators/http/route-params.decorator";
import { Injectable } from "./core/di";

@Injectable()
export class Auth{

    /**
     * @description using decorators in interceptors, passing to next interceptor or route handler function with @Next
     * we can use all params route decorators like : @Response, @Request, @Session, @Params, @Files ....
     */
    static isAuthenticated(@Next() next: any, @Response() res : any, @Headers() header: any) {
        const { host } = header;
        console.log(`Enter in isAuthenticated from host ${host}`);
        next();
    }
    
      validateParams(req: any, res: any, next: any) {
        const { id } = req.params;
        // throw  new Error('Hey, handling errors');
        if (isNaN(+id)) {
            res.end('Not a number')
        }
        next();
    }
}