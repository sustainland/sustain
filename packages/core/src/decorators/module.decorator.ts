import 'reflect-metadata';

function createModuleDecorator(): Function {
  return (config: any = '') => {
    return function (constructorFunction: Function) {
      constructorFunction.prototype.MODULE_CONFIG = config;
      constructorFunction.prototype.injectable = true;
    };
  };
}

/**
 * Create a @Module decorator
 */
export const Module = createModuleDecorator();
