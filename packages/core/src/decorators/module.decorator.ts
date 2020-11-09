import 'reflect-metadata';

function createModuleDecorator(): Function {
  return (config: any = '') => {
    return function (constructorFunction: Function) {
      constructorFunction.prototype.MODULE_CONFIG = config;
    };
  };
}

/**
 * Create a @Module decorator
 */
export const Module = createModuleDecorator();
