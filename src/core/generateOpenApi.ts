import { ROUTE_ARGS_METADATA, METHOD_METADATA, PATH_TYPE, PATH_METADATA, METHOD_RETURN } from "../constants"
import * as pathToRegexp from 'path-to-regexp'
import { RouteParamtypes } from "../enums/route-params.enum";

export let OpenApi: any;
export function generateMethodSpec(controllers: any) {
    // controllers.forEach((controller: any) => {  

    // });
    let OpenApiSchema: any = {
        "info": {
            "title": "Sustain API",
            "version": "1.0.0",
            "description": "Generated with `Sustain`"
        },
        "openapi": "3.0.0",
        "paths": {}
    };
    for (const method in controllers) {
        if (controllers.hasOwnProperty(method)) {
            const routes = controllers[method];
            routes.forEach((route: any) => {
                const url_path = expressToOpenAPIPath(route.path.value);
                if (!OpenApiSchema.paths[url_path]) {
                    OpenApiSchema.paths[url_path] = {};
                }
                OpenApiSchema.paths[url_path][method.toLocaleLowerCase()] = {
                    operationId: `${route.objectHanlder.constructor.name}.${route.handler.name}`,
                    tags: [
                        route.objectHanlder.constructor.name
                    ],
                    parameters: [
                        ...getPathParams(route),
                        ...getRequestBody(route),
                    ],
                    consumes: 'application/json',
                    "responses": {
                        "200": {
                            "content": {
                                "application/json": {}
                            },
                            "description": "Successful response"
                        }
                    },
                }
            });

        }
    }
    OpenApi = OpenApiSchema;

    // const routeParamsHandler = Reflect.getMetadata(ROUTE_ARGS_METADATA, method)
    // const methiod = Reflect.getMetadata(METHOD_METADATA, method)
    // const pathtype = Reflect.getMetadata(PATH_METADATA, method)
    // const retuntype = Reflect.getMetadata(METHOD_RETURN, method)
    // console.log("generateMethodSpec -> retuntype", retuntype)
}

export function expressToOpenAPIPath(expressPath: string) {
    const tokens = pathToRegexp.parse(expressPath)
    return tokens
        .map((d: any) => (typeof d == "string" ? d : `${d.prefix}{${d.name}}`))
        .join('')
}

function getPathParams(route: any) {
    const tokens = pathToRegexp.parse(route.path.value)
    return tokens
        .filter(token => typeof token == "object")
        .map((token: pathToRegexp.Key) => {
            const name = token.name + ''
            const param: any = {
                in: 'path',
                name,
                schema: { type: 'string' }
            }
            if (token.pattern && token.pattern !== '[^\\/]+?') {
                param.schema = { pattern: token.pattern, type: 'string' }
            }
            return param
        })
}

function getRequestBody(route: any) {
    const routeArgsMetadata = Reflect.getMetadata(ROUTE_ARGS_METADATA, route.handler);
    const tokens = [];
    for (const paramsKeys in routeArgsMetadata) {
        if (routeArgsMetadata.hasOwnProperty(paramsKeys)) {
            const [paramType] = paramsKeys.split(':')
            switch (Number(paramType)) {
                case RouteParamtypes.BODY:
                    tokens.push({
                        in: 'formData',
                        "paramType": "form",
                        name: routeArgsMetadata[paramsKeys].data,
                        schema: { type: 'string' },
                        type: 'string',
                        properties: {
                            userName: {
                                type: 'string'
                            }
                        }
                    })
                    break;
            }

        }
    }
    return tokens
}