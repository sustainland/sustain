import { Application } from './../interfaces/application.interface.ts';
import 'https://raw.githubusercontent.com/rbuckton/reflect-metadata/master/Reflect.js';

function createAppDecorator(): (config:Application)=>{} {
  return (config: Application) => {
    return function (constructorFunction: Function) {
      constructorFunction.prototype.MODULE_CONFIG = config;
      constructorFunction.prototype.injectable = true;
    };
  };
}

/**
 * Create a @App decorator
 */
export const App = createAppDecorator();
