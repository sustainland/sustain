import { resolve } from 'path';
export * from './decorators/extensions.decorator';
export * from './swagger';
export * from './decorators';
export * from './extensions/swagger';
export { match } from './utils/path-to-greex';
export * from './utils/shared.utils';

export const SWAGGER_FOLDER = {
    relative : false,
    value :  resolve(__dirname, 'public/')
};