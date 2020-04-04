import 'reflect-metadata';
import { ISwaggerInfo } from '../../interfaces/swagger.interfaces';
import { SWAGGER_META_DATA, API_MODEL_PROPERTIES_ARRAY, API_MODEL_PROPERTIES, SWAGGER_ALLOWED_TYPES } from '../../constants';
import { isString, isObject, isArray } from 'util';
import { OpenApiDefinitions } from '../../extensions/swagger/generateOpenApi';

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

function createApiTagDecorator(): Function {
    return (apitag: string) => {
        return function (constructorFunction: Function) {
            constructorFunction.prototype.API_TAG = apitag;
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

function createMethodApiResponseDecorator(): Function {
    return (responses: any[] = []) => {
        return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
            const SWAGGER_MEHTOD_PARA = Reflect.getMetadata(SWAGGER_META_DATA, target, propertyKey) || {};
            if (!SWAGGER_MEHTOD_PARA.responses) {
                SWAGGER_MEHTOD_PARA.responses = {};
            }
            if (isArray(responses)) {
                responses.forEach((response: any) => {
                    const { status, description } = response;
                    SWAGGER_MEHTOD_PARA.responses[status] = {
                        description
                    }
                })

            }
            Reflect.defineMetadata(SWAGGER_META_DATA, SWAGGER_MEHTOD_PARA, descriptor.value);
            return descriptor;
        }
    }

}

function createPropertyDecorator() {
    return (config: any = {}) => {
        return (target: object, propertyKey: string) => {
            const properties =
                Reflect.getMetadata(API_MODEL_PROPERTIES_ARRAY, target) || [];

            if (!OpenApiDefinitions[target.constructor.name]) {
                OpenApiDefinitions[target.constructor.name] = {
                    type: "object",
                    properties: {

                    }
                }
            }
            let ParamType = Reflect.getMetadata('design:type', target, propertyKey);
            if (SWAGGER_ALLOWED_TYPES.indexOf(ParamType.name) !== -1) {
                ParamType = ParamType.name.toLowerCase();
                OpenApiDefinitions[target.constructor.name]
                    .properties[propertyKey] = {
                    type: ParamType
                }
            } else {
                OpenApiDefinitions[target.constructor.name]
                    .properties[propertyKey] = {
                    $ref: `#/definitions/${ParamType.name}`
                }
            }

        };
    }

}



export const ApiProperty = createPropertyDecorator();
export const ApiConsumes = createMethodApiDecorator(ApiModes.Consumes);
export const ApiProduces = createMethodApiDecorator(ApiModes.Produces);
export const ApiResponse = createMethodApiResponseDecorator();

/**
 * Create a @Get decorator
 */
export const ApiTags = createApiTagDecorator();
export const SwaggerAPI = createSwaggerDecorator();
export const OpenAPI = SwaggerAPI;

