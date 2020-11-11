export const ROUTE_ARGS_METADATA = 'route-method-arguments';

export const SWAGGER_ALLOWED_TYPES: any[] = ['Boolean', 'Number', 'String', 'Object', 'Array'];

export enum OpenAPITypes {
  String = 'string',
  Object = 'object',
}
export enum PATH_TYPES {
  String = 0,
}
export const CONTROLLER_ROUTE = 'controller-roure';
export const CONTROLLER_CONFIG = 'controller-config';
export const PATH_METADATA = 'path';
export const MATCH_METADATA = 'match';
export const INTERCEPTORS = 'interceptors';
export const METHOD_METADATA = 'method';
export const METHOD_RETURN = 'method-return';
export const PATH_TYPE = 'path-type';
export const SWAGGER_META_DATA = 'swagger-metadata';
export const API_MODEL_PROPERTIES_ARRAY = 'API_MODEL_PROPERTIES_ARRAY';
export const API_MODEL_PROPERTIES = 'API_MODEL_PROPERTIES';
export const EMPTY_STRING = '';

export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
