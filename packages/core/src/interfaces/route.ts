import {SustainInterceptor} from './sustain-interceptor.interface';
import {Controller} from './controller.interface';
import {RoutePath} from './route-path.interface.ts';
export interface Route {
  interceptors: SustainInterceptor[];
  path: RoutePath;
  handler: Function;
  parent: Controller;
  objectHanlder: Controller;
  functionHandler: string;
}
