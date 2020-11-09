import 'reflect-metadata';

function createAppDecorator(): Function {
  return (config: any = '') => {
    return function (constructorFunction: Function) {
      constructorFunction.prototype.APP_CONFIG = config;
    };
  };
}

/**
 * Create a @Get decorator
 */
export const App = createAppDecorator();
