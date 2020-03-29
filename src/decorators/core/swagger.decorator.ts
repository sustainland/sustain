import 'reflect-metadata';
import { ISwaggerInfo } from '../../interfaces/swagger.interfaces';
import { SWAGGER_META_DATA } from '../../constants';
import { isString, isObject, isArray } from 'util';

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

function createMethodApiDecorator(): Function {
    return (consumes: any | any[] = "") => {
        return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
            const SWAGGER_MEHTOD_PARA = Reflect.getMetadata(SWAGGER_META_DATA, target, propertyKey) || {};
            if (consumes && (isString(consumes) && consumes != "") || isArray(consumes)) {
                if (isString(consumes)) {
                    consumes = [consumes]
                }
                SWAGGER_MEHTOD_PARA.consumes = [
                    ...consumes
                ];
                Reflect.defineMetadata(SWAGGER_META_DATA, SWAGGER_MEHTOD_PARA, descriptor.value);
            }

            return descriptor;
        }
    }

}

export const ApiConsumes = createMethodApiDecorator();


/**
 * Create a @Get decorator
 */
export const SwaggerAPI = createSwaggerDecorator();
export const OpenAPI = SwaggerAPI;
