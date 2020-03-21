import { ROUTE_ARGS_METADATA, METHOD_METADATA, PATH_TYPE, PATH_METADATA, METHOD_RETURN } from "../constants"
import * as pathToRegexp from 'path-to-regexp'
import { RouteParamtypes } from "../enums/route-params.enum";
import { OpenAPITypes } from "../constants";

export let OpenApi: any;
export function generateMethodSpec(controllers: any) {
    
    let OpenApiSchema: any = {
        "info": {
            "title": "Sustain API",
            "version": "1.0.0",
            "description": "Generated with `Sustain`"
        },
        "swagger": "2.0",
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
}

export function expressToOpenAPIPath(expressPath: string) {
    const tokens = pathToRegexp.parse(expressPath)
    return tokens
        .map((d: any) => (typeof d == OpenAPITypes.String ? d : `${d.prefix}{${d.name}}`))
        .join('')
}

function getPathParams(route: any) {
    const tokens = pathToRegexp.parse(route.path.value)
    return tokens
        .filter(token => typeof token == OpenAPITypes.Object)
        .map((token: pathToRegexp.Key) => {
            const name = token.name + ''
            const param: any = {
                in: 'path',
                name,
                required: true,
                schema: { type: OpenAPITypes.String }
            }
            if (token.pattern && token.pattern !== '[^\\/]+?') {
                param.schema = { pattern: token.pattern, type: OpenAPITypes.String }
            }
            return param;
        })
}

function getRequestBody(route: any) {
    const routeArgsMetadata = Reflect.getMetadata(ROUTE_ARGS_METADATA, route.handler);
    let tokens: any = [];
    const properties = [];
    for (const paramsKeys in routeArgsMetadata) {
        if (routeArgsMetadata.hasOwnProperty(paramsKeys)) {
            const [paramType] = paramsKeys.split(':')
            switch (Number(paramType)) {
                case RouteParamtypes.BODY:
                    if (routeArgsMetadata[paramsKeys].data) {
                        properties[routeArgsMetadata[paramsKeys].data] = {
                            type: routeArgsMetadata[paramsKeys].type || OpenAPITypes.String
                        }
                    }
                    break;
                case RouteParamtypes.HEADER:
                    break;
            }
        }
        if (Object.keys(properties).length !== 0) {
            tokens = [
                {
                    in: 'body',
                    name: 'body',
                    schema: { type: OpenAPITypes.Object, properties: { ...properties } }
                }
            ]
        }

    }
    return tokens
}