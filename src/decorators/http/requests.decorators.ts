import 'reflect-metadata';
import { PATH_METADATA, METHOD_METADATA, MATCH_METADATA } from '../../constants';
import { RequestMethod } from '../../enums/request-method.enum';
import { match } from '../../utils/path-to-regex';

function createDecorator(method: RequestMethod) {
    return (route?: any) => {
        return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
            Reflect.defineMetadata(MATCH_METADATA, match(route, { decode: decodeURIComponent }), descriptor.value);
            Reflect.defineMetadata(PATH_METADATA, route, descriptor.value);
            Reflect.defineMetadata(METHOD_METADATA, method, descriptor.value);
            return descriptor;
        }
    }

}

export const Get = createDecorator(RequestMethod.GET);
export const Post = createDecorator(RequestMethod.POST);

//Parameter decorator
const RequestParamFactory = (type?: string) => {
    return () => {
        return (target: any, key: string | symbol, index: number) => {
            target['request']= index;
            Reflect.defineMetadata(type, index, target.constructor, key);
        }
    }
}

export const Request = RequestParamFactory('request');