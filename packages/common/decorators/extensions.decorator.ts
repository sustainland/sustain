import 'reflect-metadata';
import { ISwaggerInfo } from '../interfaces/swagger.interfaces';

function createExtensionsDecorator(): Function {
    return (extensions: ISwaggerInfo ) => {
        return function (constructorFunction: Function) {
            const { APP_CONFIG } = constructorFunction.prototype;
            if (APP_CONFIG) {
                constructorFunction.prototype.APP_CONFIG = Object.assign(
                    APP_CONFIG,
                    {
                        extensions
                    }
                )
            }
        }
    }
}

/**
 * Create a @Get decorator
 */
export const Extensions = createExtensionsDecorator();
