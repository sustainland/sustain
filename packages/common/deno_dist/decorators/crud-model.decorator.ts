import 'https://raw.githubusercontent.com/rbuckton/reflect-metadata/master/Reflect.js';

function createCrudModelDecorator<T>(): Function {
    return (model: T) => {
        return function (constructorFunction: Function) {
            constructorFunction.prototype.CRUD_MODEL = model;
        }
    }
}

/**
 * Create a @CrudModel decorator
 */
export const CrudModel = createCrudModelDecorator();
