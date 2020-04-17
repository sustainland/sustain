import { IExtension } from "../../interfaces/IExtension.interface";
import { SRequest } from "../../interfaces";
import { Injectable } from "../../core/src";
@Injectable()
export class RequestLoggerExtension implements IExtension {
    onResquestStartHook(request: SRequest) {
        request.startAt = new Date();
    }
    onResponseEndHook(request: SRequest, response: any) {
        let endTime: any = new Date();
        let timeDiff: any = endTime - request.startAt;
        console.log(`\x1b[32m${request.method} ${request.url}\x1b[0m `, `${response.statusCode}`, "in ", timeDiff, "ms");
    }
}
