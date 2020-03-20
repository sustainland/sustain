import { getControllersMethods } from "../utils/extract-methods.util";
import { PATH_METADATA, MATCH_METADATA, INTERCEPTORS, METHOD_RETURN, CONTROLLER_ROUTE } from "../constants";
import { PATH_TYPE, METHOD_METADATA, PATH_TYPES } from "../constants";
import { RequestMethod } from '../enums/request-method.enum';
import { InjectedContainer } from './container';
import { match } from '../utils/path-to-regex';

import { createAppServer } from "./server";
import BaseController from "../controllers/base.controlle";
const DEFAULT_PORT = 5200;
const metadataKey = [
    INTERCEPTORS,
    MATCH_METADATA,
    PATH_METADATA,
    METHOD_METADATA,
    PATH_TYPE,
    METHOD_RETURN
];
const HttpRequests: any = {};


/**
 * Boostratp the Application
 * @param app 
 */
export function bootstrap(app: any) {
    let { controllers, providers } = app;
    controllers.push(BaseController);
    (providers || []).forEach((provider: any) => {
        InjectedContainer.addProvider({ provide: provider, useClass: provider });
        InjectedContainer.inject(provider);
    });

    controllers = (controllers || []).map((controller: any) => {
        InjectedContainer.inject(controller);
        return InjectedContainer.get(controller);
    });
    const requests = loadControllers(controllers);

    createAppServer(requests, app.port || DEFAULT_PORT);
}

/**
 * Prepare controllers, it functions with they metadata
 * @param controllers 
 * @return a list of methods {GET, POST, ...} and they routes
 */
export function loadControllers(controllers: any): any {
    controllers.forEach(
        (instance: any) => {
            const CONTROLLER_PREFIX = Reflect.getMetadata(CONTROLLER_ROUTE, instance);
            getControllersMethods(instance)
                .forEach((method: RequestMethod) => {
                    const payload = {
                        instance,
                        method
                    }
                    const metadatas = prepareMetadata(payload);
                    buildHttpRequests(metadatas, payload);
                });
        }
    )
    return HttpRequests;
}

/**
 * Create the http requests object to map it with the server instance
 * @param metadatas 
 * @param payload 
 */
function buildHttpRequests(metadatas: any, payload: any) {
    if (metadatas[METHOD_METADATA]) {
        if (!HttpRequests[metadatas[METHOD_METADATA]]) {
            HttpRequests[metadatas[METHOD_METADATA]] = [];
        }
        const routePath = metadatas[CONTROLLER_ROUTE] ? metadatas[CONTROLLER_ROUTE] + metadatas[PATH_METADATA] : metadatas[PATH_METADATA]
        HttpRequests[metadatas[METHOD_METADATA]].push({
            interceptors: metadatas[INTERCEPTORS],
            path: {
                value: routePath,
                match: match(routePath, { decode: decodeURIComponent }),
                type: metadatas[PATH_TYPE] || PATH_TYPES.String
            },
            handler: Object.assign(payload.instance)[payload.method],
            objectHanlder: Object.assign(payload.instance),
            functionHandler: payload.method
        })
    }
}

/**
 * Grap metadatas from the controller functions
 * @param payload 
 * @param object of metadata  
 */
function prepareMetadata(payload: any): any {
    const metadatas: any = {};
    if (payload.instance.route) {
        metadatas[CONTROLLER_ROUTE] = payload.instance.route;
    }
    metadataKey.forEach((key: string) => {
        metadatas[key] = Reflect.getMetadata(key, Object.assign(payload.instance)[payload.method])
    });
    return metadatas;
}