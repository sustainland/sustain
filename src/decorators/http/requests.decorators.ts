import 'reflect-metadata';
import { PATH_METADATA, METHOD_METADATA } from '../../constants';
import { RequestMethod } from '../../enums/request-method.enum';

function createDecorator(method: RequestMethod) {
    return (route?: any) => {
        console.log('-----------', route)
        return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {

            Reflect.defineMetadata(PATH_METADATA, route, descriptor.value);
            Reflect.defineMetadata(METHOD_METADATA, method, descriptor.value);
            return descriptor;
        }
    }

}

export const Get = createDecorator(RequestMethod.GET);
export const Post = createDecorator(RequestMethod.POST);

