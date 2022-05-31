import 'reflect-metadata';

function createAppDecorator(): Function {
  return (config: any = '') => {
    return function (constructorFunction: Function) {
      constructorFunction.prototype.MODULE_CONFIG = config;
      constructorFunction.prototype.injectable = true;
    };
  };
}

/**
 * Create a @Get decorator
 */
export const App = createAppDecorator();
