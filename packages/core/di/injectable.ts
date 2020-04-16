import { Type } from "./type";
import { CONTROLLER_ROUTE } from "../../../src/constants";
import "reflect-metadata";

const INJECTABLE_METADATA_KEY = Symbol("INJECTABLE_KEY");
export const Injectable = function (route?: string) {
  return function (target: any) {
    Reflect.defineMetadata(INJECTABLE_METADATA_KEY, true, target);
    Reflect.defineMetadata(CONTROLLER_ROUTE, route, target);
    target.prototype.route = route;
    return target;
  };
}

export const Controller = Injectable;
export const SExtension = Injectable;

export function isInjectable<T>(target: Type<T>) {
  return Reflect.getMetadata(INJECTABLE_METADATA_KEY, target) === true;
}
