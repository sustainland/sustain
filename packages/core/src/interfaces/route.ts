import {SustainInterceptor} from './sustain-interceptor.interface';
import {Controller} from './controller.interface';
export interface Route {
  interceptors: SustainInterceptor[];
  path: any;
  handler: Function;
  parent: Controller;
  objectHanlder: Controller;
  functionHandler: string;
}
