import {RequestMethod} from './../enums/request-method.enum';
import {InjectedContainer} from './../di/dependency-container';
import {
  CONTROLLER_ROUTE,
  CONTROLLER_CONFIG,
  METHOD_METADATA,
  PATH_TYPE,
  PATH_METADATA,
  INTERCEPTORS,
  MATCH_METADATA,
  METHOD_RETURN,
  PATH_TYPES,
} from './../constants';
import {match} from '@sustain/common';
import {getControllersMethods} from './extract-methods.util';
const metadataKey = [INTERCEPTORS, MATCH_METADATA, PATH_METADATA, METHOD_METADATA, PATH_TYPE, METHOD_RETURN];
const HttpRequests: any = {};

/**
 * Create the http requests object to map it with the server instance
 * @param metadatas
 * @param payload
 */
export function buildHttpRequests(metadatas: any, payload: any): any {
  if (metadatas[METHOD_METADATA]) {
    if (!HttpRequests[metadatas[METHOD_METADATA]]) {
      HttpRequests[metadatas[METHOD_METADATA]] = [];
    }
    const routePath = metadatas[CONTROLLER_ROUTE]
      ? metadatas[CONTROLLER_ROUTE] + metadatas[PATH_METADATA]
      : metadatas[PATH_METADATA];
    HttpRequests[metadatas[METHOD_METADATA]].push({
      interceptors: metadatas[INTERCEPTORS],
      path: {
        value: routePath,
        match: match(routePath, {decode: decodeURIComponent}),
        type: metadatas[PATH_TYPE] || PATH_TYPES.String,
      },
      handler: Object.assign(payload.instance)[payload.method],
      parent: payload.instance,
      objectHanlder: Object.assign(payload.instance),
      functionHandler: payload.method,
    });
  }
  return HttpRequests;
}

/**
 * Grap metadatas from the controller functions
 * @param payload
 * @param object of metadata
 */
export function prepareMetadata(payload: any): any {
  const metadatas: any = {};
  if (payload.instance.route) {
    metadatas[CONTROLLER_ROUTE] = payload.instance.route;
    metadatas[CONTROLLER_CONFIG] = payload.instance;
  }
  metadataKey.forEach((key: string) => {
    metadatas[key] = Reflect.getMetadata(key, Object.assign(payload.instance)[payload.method]);
  });
  return metadatas;
}

/**
 * Prepare controllers, it functions with they metadata
 * @param controllers
 * @return a list of methods {GET, POST, ...} and they routes
 */
export function loadControllers(controllers: any): any {
  (controllers || []).forEach((controller: any) => {
    const injectedController = InjectedContainer.get(controller);
    getControllersMethods(injectedController).forEach((method: RequestMethod) => {
      const payload = {
        instance: injectedController,
        method,
      };
      const metadatas = prepareMetadata(payload);
      buildHttpRequests(metadatas, payload);
    });
  });
  return HttpRequests;
}
