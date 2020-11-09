import {Injectable} from '../../core/src';
@Injectable()
export class RequestLoggerExtension {
  onResquestStartHook(request: any) {
    request.startAt = new Date();
  }
  onResponseEndHook(request: any, response: any) {
    let endTime: any = new Date();
    let timeDiff: any = endTime - request.startAt;
    console.log(`\x1b[32m${request.method} ${request.url}\x1b[0m `, `${response.statusCode}`, 'in ', timeDiff, 'ms');
  }
}
