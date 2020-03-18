
const { readFile } = require('fs');
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { ROUTE_ARGS_METADATA } from '../constants';
import { RouteParamtypes } from '../enums/route-params.enum';
import { RequestMethod } from '../enums/request-method.enum';
import { InjectedContainer } from './container';
import { SessionProviders } from './sessions-providers';
import { ContentType } from '../enums/content-type.enum';
import { SessionManager } from './sessions';
import { join } from 'path';
import * as  querystring from 'querystring';
const mode = "debug";
class Request extends IncomingMessage {
    params: { [key: string]: string | undefined };
}
const SessionsManager: SessionManager = InjectedContainer.get(SessionManager);


export function createAppServer(requests: any, port: number) {


    const server = createServer(async (request: Request, response: ServerResponse) => {
        try {
            SessionsManager.createIfNotExistsNewSession(request, response);
            response.setHeader('x-powered-by', 'Sustain Server');
            if (requests[request.method]) {
                let body: any = [];
                if (request.method === RequestMethod.POST) {
                    await new Promise((resolve, reject) => {
                        request.on('data', (chunk) => {
                            body.push(chunk);
                        }).on('end', () => {
                            body = Buffer.concat(body).toString();
                            if (request.headers['content-type'] == ContentType.APPLICATION_JSON) {
                                try {
                                    body = JSON.parse(body);
                                } catch (error) {
                                    response.statusCode = 500;
                                    response.end(error.toString())
                                    response.destroy();
                                }
                            }
                            resolve();
                        }).on('error', (error) => {
                            console.log("server -> error", error)
                            reject()
                        });
                    });
                }

                const route = requestSegmentMatch(requests, request);
                if (route) {
                    if (route.interceptors) {
                        await executeInterceptor(route, request, response)
                    }
                    const routeParamsHandler = Reflect.getMetadata(ROUTE_ARGS_METADATA, route.handler) || {}

                    const methodArgs: any[] = fillMethodsArgs(routeParamsHandler, { request, response, body })
                    const result = route.objectHanlder[route.functionHandler](...methodArgs);

                    if (result) {
                        if (result instanceof Promise) {
                            response.end(await result)
                        } else if (typeof result == 'object') {
                            response.end(JSON.stringify(result));
                        } else {
                            response.end(String(result));
                        }
                    }
                } else {
                    render404Page(response);
                }
            } else {
                render404Page(response);
            }
            response.on('error', (error) => {
                console.log(error)
            })
        } catch (error) {
            console.log(error);

        }
    });
    server.listen(port).on('listening', () => {
        console.log('\x1b[32m%s\x1b[0m', ' App is running', `at http://localhost:${port} in ${mode}`);  //yellow


        console.log(" Press CTRL-C to stop\n");
    });
    server.on('error', (error: Error) => {
        console.log(error);
    });

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
            console.log('\x1b[31m%s\x1b[0m', `${e.message}, ${e.stack}`);
            response.end(`${e.message}, ${e.stack}
            `)
            throw e;
        })
}


function render404Page(response: any) {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    readFile(join(__dirname, '../views/404.html'), (err: any, data: any) => {
        if (!err) {
            response.end(data);
        } else {
            console.log(err)
        }
    })
}

function render505Page(response: any) {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    readFile(join(__dirname, '../views/500.html'), (err: any, data: any) => {
        if (!err) {
            response.end(data);
        } else {
            console.log(err)
        }
    })
}

function requestSegmentMatch(requests: any, request: any) {
    return requests[request.method].find((route: any) => {
        const requestRouteDetails = route.path.match(request.url.split("?")[0]);
        if (requestRouteDetails) {
            request.params = requestRouteDetails.params
            return true;
        }
    })
}


function fillMethodsArgs(routeParamsHandler: any, assets: any) {
    const methodArgs: any[] = [];
    Object.keys(routeParamsHandler).forEach((args) => {
        const [arg_type, arg_index] = args.split(':');
        const additionalData = routeParamsHandler[args].data;
        // console.log("fillMethodsArgs -> arg_type, arg_index", arg_type, arg_index)
        switch (Number(arg_type)) {
            case RouteParamtypes.REQUEST:
                methodArgs[Number(arg_index)] = assets.request;
                break;
            case RouteParamtypes.RESPONSE:
                methodArgs[Number(arg_index)] = assets.response;
                break;
            case RouteParamtypes.SESSION:
                methodArgs[Number(arg_index)] = SessionsManager.getSession(assets.request);
                break;
            case RouteParamtypes.HEADERS:
                methodArgs[Number(arg_index)] = assets.request.headers;
                break;
            case RouteParamtypes.BODY:
                methodArgs[Number(arg_index)] = assets.body;
                break;
            case RouteParamtypes.HEADER:
                methodArgs[Number(arg_index)] = assets.request.headers[additionalData];
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
    console.log('\x1b[31m%s\x1b[0m', error.stack);  //yellow
})