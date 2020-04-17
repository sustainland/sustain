import { INTERCEPTORS } from "../constants";

function createDecorator() {
    return (interceptors: any[] = []) => {
        return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
            Reflect.defineMetadata(INTERCEPTORS, interceptors, descriptor.value);
            return descriptor;
        }
    }

}

export const Interceptors = createDecorator();