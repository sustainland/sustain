import {SustainResponse} from './../../interfaces/SustainResponce.interface';
import {SustainExtension} from './../../interfaces/IExtension.interface';
import {Injectable} from './../../di/injectable';
import {SustainRequest} from '../../interfaces';
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
