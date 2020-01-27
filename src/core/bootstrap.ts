import { getControllersMethods } from "../utils/extract-methods.util";
import { PATH_METADATA, MATCH_METADATA, INTERCEPTORS } from "../constants";
import { PATH_TYPE } from "../constants";
import { METHOD_METADATA } from "../constants";
import { PATH_TYPES } from "../constants";
import { createAppServer } from "./server";


export function bootstrap(app: any): any {
    const { controllers } = app;
    const requests = loadControllers(controllers);
    createAppServer(requests);
}

export function loadControllers(controllers: any) {
    const Http_Requests: any = {};
    controllers.forEach(
        (controller: any) => {
            const instance = new controller();
            getControllersMethods(instance)
                .forEach((method: string) => {
                    const metadatas = {
                        INTERCEPTORS: Reflect.getMetadata(INTERCEPTORS, Object.assign(instance)[method]),
                        MATCH_METADATA: Reflect.getMetadata(MATCH_METADATA, Object.assign(instance)[method]),
                        PATH_METADATA: Reflect.getMetadata(PATH_METADATA, Object.assign(instance)[method]),
                        METHOD_METADATA: Reflect.getMetadata(METHOD_METADATA, Object.assign(instance)[method]),
                        PATH_TYPE: Reflect.getMetadata(PATH_TYPE, Object.assign(instance)[method]),
                    }
                    if (metadatas.METHOD_METADATA) {
                        if (!Http_Requests[metadatas.METHOD_METADATA]) {
                            Http_Requests[metadatas.METHOD_METADATA] = [];
                        }
                        Http_Requests[metadatas.METHOD_METADATA].push({
                            interceptors: metadatas.INTERCEPTORS,
                            path: {
                                value: metadatas.PATH_METADATA,
                                match: metadatas.MATCH_METADATA,
                                type: metadatas.PATH_TYPE || PATH_TYPES.String
                            },
                            handler: Object.assign(instance)[method]
                        })
                    }
                    return {
                        method_name: method,
                        metadata: {
                            PATH_METADATA: Reflect.getMetadata(PATH_METADATA, Object.assign(instance)[method])
                        }
                    }
                });
        }
    )
    return Http_Requests;
}


