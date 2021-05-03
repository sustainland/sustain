import { INTERCEPTORS } from "../constants.ts";

function createDecorator() {
    return (interceptors: any[] = []) => {
        return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
            Reflect.defineMetadata(INTERCEPTORS, interceptors, descriptor.value);
            return descriptor;
        }
    }

}

export const Interceptors = createDecorator();