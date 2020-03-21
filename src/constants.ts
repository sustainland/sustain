export const CONTROLLER_ROUTE = 'controller-roure';
export const PATH_METADATA = 'path';
export const MATCH_METADATA = 'match';
export const INTERCEPTORS = 'interceptors';
export const ROUTE_ARGS_METADATA = 'route-method-arguments';
export const METHOD_METADATA = 'method';
export const METHOD_RETURN = 'method-return';
export const PATH_TYPE = 'path-type';
export enum PATH_TYPES {
    String = 0
}


export enum SessionsProviders {
    File,
    Mongo
}

export const SESSION_FILE_PATH = 'sessions.save';

export enum OpenAPITypes {
    String = 'string',
    Object = 'object'
}