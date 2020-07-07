import {
    ROUTE_ARGS_METADATA,
    SWAGGER_META_DATA,
    SWAGGER_ALLOWED_TYPES,
    OpenAPITypes
} from "../../constants"
import * as pathToRegexp from 'path-to-regexp'
import { RouteParamtypes } from "../../enums/route-params.enum";
import { ISwaggerInfo } from "../../interfaces/swagger.interfaces";
import { RequestMethod } from "../../enums/request-method.enum";

export let OpenApi: any;
export let OpenApiDefinitions: any = {}
export function getOpenApi() {
    return OpenApi;
}
export function generateMethodSpec(controllers: any, config: any) {

    const swaggerConfig: ISwaggerInfo = config.swaggerConfig;
    let OpenApiSchema: any = {
        ...swaggerConfig,
        paths: {},
        definitions: {
            ...OpenApiDefinitions
        },
    };
    if (config.extensions && config.extensions.swagger && config.extensions.swagger.enabled) {
        if (swaggerConfig) {
            for (const method in controllers) {
                if (controllers.hasOwnProperty(method)) {
                    const routes = controllers[method];
                    routes.forEach((route: any) => {
                        const url_path = expressToOpenAPIPath(route.path.value);
                        if (!OpenApiSchema.paths[url_path]) {
                            OpenApiSchema.paths[url_path] = {};
                        }
                        const SWAGGER_MEHTOD_PARAMETERS = Reflect.getMetadata(SWAGGER_META_DATA, route.handler) || {};
                        OpenApiSchema.paths[url_path][method.toLocaleLowerCase()] = {
                            operationId: `${route.objectHanlder.constructor.name}.${route.handler.name}`,
                            tags: [
                                route.objectHanlder.constructor.prototype.API_TAG || route.objectHanlder.constructor.name
                            ],
                            parameters: [
                                ...getPathParams(route),
                                ...getRequestBody(route, method),
                            ],
                            consumes: SWAGGER_MEHTOD_PARAMETERS.consumes || [],
                            produces: SWAGGER_MEHTOD_PARAMETERS.produces || [],
                            responses: SWAGGER_MEHTOD_PARAMETERS.responses || {}
                        }
                    });

                }
            }
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

function getRequestBody(route: any, method?: any) {
    const routeArgsMetadata = Reflect.getMetadata(ROUTE_ARGS_METADATA, route.handler);
    let { CRUD_MODEL } = route.objectHanlder.constructor.prototype;
    if (CRUD_MODEL) {
        CRUD_MODEL = CRUD_MODEL.prototype.constructor.name;
    }
    let tokens: any = [];
    const properties: any = [];
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
        let useSchema;

        if (CRUD_MODEL && method
            && [
                RequestMethod.POST,
                RequestMethod.PUT,
                RequestMethod.PATCH
            ].includes(method)) {
            useSchema = {
                $ref: `#/definitions/${CRUD_MODEL}`
            }
        } else {
            if (!SWAGGER_ALLOWED_TYPES
                .map(type => type.toLocaleLowerCase())
                .includes(routeArgsMetadata[paramsKeys].type)) {
                useSchema = {
                    $ref: `#/definitions/${routeArgsMetadata[paramsKeys].type}`
                }
            } else {
                useSchema = { type: OpenAPITypes.Object, properties: { ...properties } }
            }
        }

        if (Object.keys(properties).length !== 0) {
            tokens = [
                {
                    in: 'body',
                    name: 'body',
                    schema: useSchema
                }
            ]
        } else {
            if (method && method == RequestMethod.POST) {
                tokens = [
                    {
                        in: 'body',
                        name: 'body',
                        type: OpenAPITypes.Object,
                        schema: useSchema
                    }
                ]
            }
        }

    }
    return tokens
}