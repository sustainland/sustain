import 'reflect-metadata';
import { ISwaggerInfo } from '../../interfaces/swagger.interfaces';

function createSwaggerDecorator(): Function {
    return (swaggerConfig: ISwaggerInfo ) => {
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

/**
 * Create a @Get decorator
 */
export const SwaggerAPI = createSwaggerDecorator();
export const OpenAPI = SwaggerAPI;
