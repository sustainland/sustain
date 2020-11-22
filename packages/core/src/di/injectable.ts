import {INJECTABLE_METADATA_KEY} from './../constants';
import {Type} from './type';
import {CONTROLLER_ROUTE} from '../constants';
import 'reflect-metadata';

export const Injectable = function (route?: string, config?: any) {
  return function (target: any) {
    Reflect.defineMetadata(INJECTABLE_METADATA_KEY, true, target);
    Reflect.defineMetadata(CONTROLLER_ROUTE, route, target);
    target.prototype.route = route;
    target.prototype.config = config;
    return target;
  };
};

export const Controller = Injectable;
export const SExtension = Injectable;

export function isInjectable<T>(target: Type<T>) {
  return Reflect.getMetadata(INJECTABLE_METADATA_KEY, target) === true || target.prototype?.injectable === true;
}
