import 'reflect-metadata';

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
