import { fileExtension } from '@sustain/common';
// import { SessionManager, SessionProviders } from '@sustain/session';
// 
const { readFile } = require('fs');
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { ROUTE_ARGS_METADATA } from './constants';
import { join } from 'path';
import * as  querystring from 'querystring';
import { generateMethodSpec } from '@sustain/common';
import { serveStatic } from './static-server/serve';
// import { prepareBody } from './body-parser';
import { render404Page } from './static-server/render-error-pages';
import { SRequest } from './interfaces';
import { isArray } from 'util';
import { InjectedContainer } from './di';
import { RouteParamtypes } from './enums/route-params.enum';

const mode = "debug";
// const SessionsManager: SessionManager = InjectedContainer.get(SessionManager);
// const SessionProvider = InjectedContainer.get(SessionProviders);

const exntensionContainer: any[] = [];

export function createAppServer(requests: any, config: any) {
    generateMethodSpec(requests, config);
    const { extensions, expressMiddlewares } = config;
    if (extensions.session && extensions.session.provider != undefined) {
        // SessionProvider.initiateProvider(extensions.session.provider);
        // SessionsManager.loadProvider();
    }

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
            // SessionsManager.createIfNotExistsNewSession(request, response);
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
            // await new Promise((resolve, reject) => {
            //     bodyParser.json()(request, response, resolve)
            // })

            response.setHeader('x-powered-by', 'Sustain Server');
            response.setHeader('Access-Control-Allow-Origin', '*');
            // SessionsManager.requestApply(request);
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
                    config.staticFolder.forEach((staticFolderPath: any) => {
                        try {
                            serveStatic(staticFolderPath, request, response);
                        } catch (e) {
                        }
                    });
                } catch (e) {
                    console.log(request.url)
                }
                if (!request.staticFileExist) {
                    render404Page(response);
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
            console.log(error);

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

process.on('uncaughtException', (error) => {
});