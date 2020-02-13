
const { readFile } = require('fs');
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { ROUTE_ARGS_METADATA } from '../constants';
import { RouteParamtypes } from '../enums/route-params.enum';
import { InjectedContainer } from './container';
import { SessionProviders } from './sessions-providers';
import { SessionManager } from './sessions';
const port = 5002;
const mode = "debug";
class Request extends IncomingMessage {
    params: { [key: string]: string | undefined };
}
const SessionsManager: SessionManager = InjectedContainer.get(SessionManager);


export function createAppServer(requests: any) {


    const server = createServer(async (request: Request, response: ServerResponse) => {
        try {
            SessionsManager.createIfNotExistsNewSession(request, response);
            response.setHeader('x-powered-by', 'Sustain Server');
            if (requests[request.method]) {
                const route = requestSegmentMatch(requests, request);
                if (route) {
                    if (route.interceptors) {
                        await executeInterceptor(route, request, response)
                    }
                    const routeParamsHandler = Reflect.getMetadata(ROUTE_ARGS_METADATA, route.handler) || {}
                    const methodArgs: any[] = fillMethodsArgs(routeParamsHandler, { request, response })
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
    readFile('views/404.html', (err: any, data: any) => {
        if (!err) {
            response.end(data);
        } else {
            console.log(err)
        }
    })
}

function render505Page(response: any) {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    readFile('views/505.html', (err: any, data: any) => {
        if (!err) {
            response.end(data);
        } else {
            console.log(err)
        }
    })
}

function requestSegmentMatch(requests: any, request: any) {
    return requests[request.method].find((route: any) => {
        const requestRouteDetails = route.path.match(request.url);
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
            case RouteParamtypes.PARAMS:
                methodArgs[Number(arg_index)] = assets.request.params;
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