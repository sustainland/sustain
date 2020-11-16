import { Response, Next, Headers } from '@sustain/common';
import { Injectable, SustainInterceptor } from "@sustain/core";

@Injectable()
export class PlayerInterceptors implements SustainInterceptor {
    constructor() { }

    /**
     * @description using decorators in interceptors, passing to next interceptor or route handler function with @Next
     * we can use all params route decorators like : @Response, @Request, @Session, @Params, @Files ....
     */
    intercept(@Next() next: any, @Response() response: any, @Headers() header: any) {
        const { host } = header;
        response.end(`Enter in PlayerInterceptors ${host}`);
        next();
    }

}