import 'reflect-metadata';
import { ISwaggerInfo } from '../../interfaces/swagger.interfaces';
import { SWAGGER_META_DATA } from '../../constants';
import { isString, isObject, isArray } from 'util';

export enum ApiModes {
    Consumes = 'CONSUMES',
    Produces = 'PRODUCES'
}

function createSwaggerDecorator(): Function {
    return (swaggerConfig: ISwaggerInfo) => {
        return function (constructorFunction: Function) {
            const { APP_CONFIG } = constructorFunction.prototype;
            if (APP_CONFIG) {
                constructorFunction.prototype.APP_CONFIG = Object.assign(
                    APP_CONFIG,
                    {
                        swaggerConfig
                    }
                )
            }
        }
    }
}

function createMethodApiDecorator(mode: any): Function {
    return (params: any | any[] = "") => {
        return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
            const SWAGGER_MEHTOD_PARA = Reflect.getMetadata(SWAGGER_META_DATA, target, propertyKey) || {};
            if (params && (isString(params) && params != "") || isArray(params)) {
                if (mode == ApiModes.Consumes) {
                    if (isString(params)) {
                        params = [params]
                    }
                    SWAGGER_MEHTOD_PARA.consumes = [
                        ...params
                    ];
                } else if (mode == ApiModes.Produces) {
                    SWAGGER_MEHTOD_PARA.produces = [
                        ...params
                    ];
                }
            }

            Reflect.defineMetadata(SWAGGER_META_DATA, SWAGGER_MEHTOD_PARA, descriptor.value);
            return descriptor;
        }
    }

}

export const ApiConsumes = createMethodApiDecorator(ApiModes.Consumes);
export const ApiProduces = createMethodApiDecorator(ApiModes.Produces);


/**
 * Create a @Get decorator
 */
export const SwaggerAPI = createSwaggerDecorator();
export const OpenAPI = SwaggerAPI;

