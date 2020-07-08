import { RequestMethod } from './enums/request-method.enum';
import { getControllersMethods } from "./utils";
import { PATH_TYPE, METHOD_METADATA, PATH_TYPES, PATH_METADATA, MATCH_METADATA, INTERCEPTORS, METHOD_RETURN, CONTROLLER_ROUTE } from "./constants";

import { createAppServer } from "./server";
import { InjectedContainer } from "./di/dependency-container";
import { match } from '@sustain/common';
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
export function bootstrap(app: any): any {
    try {
        const { APP_CONFIG } = app.prototype;
        let { controllers, providers, extensions, modules } = APP_CONFIG;
        (modules || []).forEach((module: any) => {
            const moduleMetaData = getModuleConfig(module);
            controllers = [... (controllers || []), ...moduleMetaData.controllers]
            providers = [...(providers || []), ...(moduleMetaData.providers || [])]
        });
        (providers || []).forEach((provider: any) => {
            InjectedContainer.addProvider({ provide: provider, useClass: provider });
            InjectedContainer.inject(provider);
        });

        controllers = (controllers || []).map((controller: any) => {
            InjectedContainer.inject(controller);
            return InjectedContainer.get(controller);
        });

        APP_CONFIG.extensions.load = (extensions.load || []).map((extension: any) => {
            InjectedContainer.inject(extension);
            return InjectedContainer.get(extension);
        });

        const requests = loadControllers(controllers);
        return createAppServer(requests, {
            port: APP_CONFIG.port || DEFAULT_PORT,
            staticFolders: [...APP_CONFIG.staticFolders],
            swaggerConfig: APP_CONFIG.swaggerConfig,
            extensions: APP_CONFIG.extensions || {},
            expressMiddlewares: APP_CONFIG.extensions.expressMiddlewares || [],
        });
    } catch (e) {
        console.log(e)
    }

}

function getModuleConfig(module: any) {
    const { MODULE_CONFIG } = module.prototype;
    let { controllers, providers, extensions, modules } = MODULE_CONFIG;

    if (Array.isArray(modules)) {
        modules.forEach((childModule: any) => {
            const childModulemetaData = getModuleConfig(childModule);
            controllers = [...controllers, ...childModulemetaData.controllers]
            providers = [...providers, ...childModulemetaData.providers]
            extensions = [...extensions, ...childModulemetaData.extensions]
        });
    }
    return {
        controllers, providers, extensions
    }
}
/**
 * Prepare controllers, it functions with they metadata
 * @param controllers 
 * @return a list of methods {GET, POST, ...} and they routes
 */
export function loadControllers(controllers: any): any {
    controllers.forEach(
        (instance: any) => {
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