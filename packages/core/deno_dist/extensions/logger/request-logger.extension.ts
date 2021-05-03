import {SustainResponse} from './../../interfaces/SustainResponce.interface.ts';
import {SustainExtension} from '../../interfaces/sustain-extension.interface.ts';
import {Injectable} from './../../di/injectable.ts';
import {SustainRequest} from '../../interfaces/index.ts';
@Injectable()
export class RequestLoggerExtension implements SustainExtension {
  onResquestStartHook(request: SustainRequest) {
    request.startAt = new Date();
  }
  onResponseEndHook(request: SustainRequest, response: SustainResponse) {
    const endTime: any = new Date();
    const timeDiff: any = endTime - request.startAt;
    let color;
    if (response.statusCode < 400) {
      color = `\x1b[32m$$\x1b[0m `;
    } else {
      color = `\x1B[31m$$\x1b[0m`;
    }
    console.log(
      color.replace('$$', `${request.method} ${request.url}`),
      `${response.statusCode}`,
      'in ',
      timeDiff,
      'ms'
    );
  }
}
