import 'reflect-metadata';
import {ISwaggerInfo} from '../interfaces/swagger.interfaces';

function createExtensionsDecorator(): Function {
  return (extensions: ISwaggerInfo) => {
    return function (constructorFunction: Function) {
      const {MODULE_CONFIG} = constructorFunction.prototype;
      if (MODULE_CONFIG) {
        constructorFunction.prototype.MODULE_CONFIG = Object.assign(MODULE_CONFIG, {
          extensions,
        });
      }
    };
  };
}

/**
 * Create a @Get decorator
 */
export const Extensions = createExtensionsDecorator();
