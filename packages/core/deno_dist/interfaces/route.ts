import {SustainInterceptor} from './sustain-interceptor.interface.ts';
import {Controller} from './controller.interface.ts';
export interface Route {
  interceptors: SustainInterceptor[];
  path: any;
  handler: Function;
  parent: Controller;
  objectHanlder: Controller;
  functionHandler: string;
}
