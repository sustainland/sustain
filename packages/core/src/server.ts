import { fileExtension } from '@sustain/common';
import { createServer, ServerResponse } from 'http';
import { ROUTE_ARGS_METADATA } from './constants';
import * as  querystring from 'querystring';
import { generateMethodSpec } from '@sustain/common';
import { serveStatic } from './static-server/serve';
import { render404Page } from './static-server/render-error-pages';
import { SRequest } from './interfaces';
import { isArray } from 'util';
import { RouteParamtypes } from './enums/route-params.enum';

const mode = "debug";

const exntensionContainer: any[] = [];

export function createAppServer(requests: any, config: any) {
    generateMethodSpec(requests, config);
    const { extensions, expressMiddlewares } = config;

    if (extensions.load && isArray(extensions.load)) {
        extensions.load.forEach((extension: any) => {
            exntensionContainer.push(extension)
        })
    }

    const server = createServer(async (request: SRequest, response: ServerResponse) => {
        try {
            exntensionContainer.forEach((extension: any) => {
                if (extension.onResquestStartHook) {
                    extension.onResquestStartHook(request, response)
                }
            });
            const middlewares = [];
            for (let middleware of expressMiddlewares) {
                middlewares.push(new Promise((resolve, reject) => {
                    return middleware(request, response, resolve)
                }))
            }
            await Promise.all(middlewares)
                .catch((e: Error) => {
                    response.end(`${e.message}, ${e.stack}
                `)
                    throw e;
                })


            response.setHeader('x-powered-by', 'Sustain Server');
            response.setHeader('Access-Control-Allow-Origin', '*');
            const route = requestSegmentMatch(requests, request);
            if (route) {
                if (route.interceptors) {
                    await executeInterceptor(route, request, response)
                }
                const routeParamsHandler = Reflect.getMetadata(ROUTE_ARGS_METADATA, route.handler) || {}
                const methodArgs: any[] = fillMethodsArgs(routeParamsHandler, { request, response, body: request.body })
                const result = route.objectHanlder[route.functionHandler](...methodArgs);

                if (result instanceof Promise) {
                    const output = await result;
                    if (typeof output == 'object') {
                        response.writeHead(200, { 'Content-Type': 'application/json' });
                        response.end(JSON.stringify(output));
                    }
                    else {
                        response.end(await output);
                    }
                } else if (typeof result == 'object') {
                    response.writeHead(200, { 'Content-Type': 'application/json' });
                    response.end(JSON.stringify(result));
                } else {
                    response.end(String(result));
                }

            } else {
                try {
                    const extesnion = fileExtension(request.url);
                    if (!extesnion && request.url.endsWith('/')) {
                        request.url = request.url.replace(/\/$/, "");
                        request.url += '/index.html';
                    }
                    config.staticFolders.forEach((staticFoldersPath: any) => {
                        try {
                            serveStatic(staticFoldersPath, request, response);
                        } catch (e) {
                        }
                    });
                } catch (e) {
                    console.log(request.url)
                }
                if (!request.staticFileExist) {
                    throw new Error("Not Found")
                }
            }

            response.on('error', (error) => {
                console.log(error)
            })
            response.on('finish', () => {
                // TODO: move this to log extension
                exntensionContainer.forEach((extension: any) => {
                    if (extension.onResponseEndHook) {
                        extension.onResponseEndHook(request, response)
                    }
                });
            })
        } catch (error) {
            console.error(error);
            
            render404Page(response, error);
        }
    });
    server.listen(config.port).on('listening', () => {
        console.log('\x1b[32m%s\x1b[0m', ' App is running', `at http://localhost:${config.port} in ${mode}`);
        console.log(" Press CTRL-C to stop\n");
    });
    server.on('error', (error: Error) => {
        console.log(error);
    });
    return server;
}


async function executeInterceptor(route: any, request: any, response: any) {
    const callstack = [];
    for (let interceptor of route.interceptors) {
        const routeParamsHandler = Reflect.getMetadata(ROUTE_ARGS_METADATA, interceptor) || {}

        callstack.push(new Promise((resolve, reject) => {
            const methodArgs: any[] = fillMethodsArgs(routeParamsHandler, { request, response, resolve })
            return interceptor(...methodArgs)
        }))
    }
    return Promise.all(callstack)
        .catch((e: Error) => {
            response.end(`${e.message}, ${e.stack}
            `)
            throw e;
        })
}



function requestSegmentMatch(requests: any, request: any) {
    return requests[request.method].find((route: any) => {
        const requestRouteDetails = route.path.match(request.url.split("?")[0]);
        if (requestRouteDetails) {
            request.params = requestRouteDetails.params;
            return true;
        }
    })
}


function fillMethodsArgs(routeParamsHandler: any, assets: any) {
    const methodArgs: any[] = [];
    Object.keys(routeParamsHandler).forEach((args) => {
        const [arg_type, arg_index] = args.split(':');
        const additionalData = routeParamsHandler[args].data;
        switch (Number(arg_type)) {
            case RouteParamtypes.REQUEST:
                methodArgs[Number(arg_index)] = assets.request;
                break;
            case RouteParamtypes.RESPONSE:
                methodArgs[Number(arg_index)] = assets.response;
                break;
            case RouteParamtypes.SESSION:
                methodArgs[Number(arg_index)] = assets.request.session;
                break;
            case RouteParamtypes.HEADERS:
                methodArgs[Number(arg_index)] = assets.request.headers;
                break;
            case RouteParamtypes.BODY:
                let askedBody;
                if (additionalData) {
                    askedBody = assets.request.body[additionalData];
                } else {
                    askedBody = assets.request.body;
                }
                methodArgs[Number(arg_index)] = askedBody;
                break;
            case RouteParamtypes.HEADER:
                let askedHeader;
                if (additionalData) {
                    askedHeader = assets.request.headers[additionalData];
                } else {
                    askedHeader = assets.request.headers;
                }
                methodArgs[Number(arg_index)] = askedHeader;
                break;
            case RouteParamtypes.PARAMS:
                methodArgs[Number(arg_index)] = assets.request.params;
                break;
            case RouteParamtypes.QUERY:
                // TODO: refactor this to a function
                const query = querystring.parse(assets.request.url.split("?")[1]);
                let askedQuery = {};
                if (additionalData) {
                    askedQuery = query[additionalData];
                } else {
                    askedQuery = { ...query };
                }
                methodArgs[Number(arg_index)] = askedQuery;
                break;
            case RouteParamtypes.PARAM:
                methodArgs[Number(arg_index)] = assets.request.params[additionalData];
                break;
            case RouteParamtypes.NEXT:
                methodArgs[Number(arg_index)] = assets.resolve;
                break;
        }
    });

    return methodArgs;
}

