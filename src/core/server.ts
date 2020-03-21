
const { readFile } = require('fs');
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { ROUTE_ARGS_METADATA } from '../constants';
import { RouteParamtypes } from '../enums/route-params.enum';
import { RequestMethod } from '../enums/request-method.enum';
import { InjectedContainer } from './container';
import { SessionProviders } from './sessions-providers';
import { ContentType } from '../enums/content-type.enum';
import { SessionManager } from './sessions';
import { join, normalize, resolve } from 'path';
import * as  querystring from 'querystring';
import { generateMethodSpec } from './generateOpenApi';
import { readFileSync, existsSync } from 'fs';
const mode = "debug";

class Request extends IncomingMessage {
    params: { [key: string]: string | undefined };
    staticFileExist?: boolean;
    startAt?: any;
}
const SessionsManager: SessionManager = InjectedContainer.get(SessionManager);

const serveStatic = (staticBasePath: string, request: any, response: any) => {
    var resolvedBase = resolve(staticBasePath);
    var safeSuffix = normalize(request.url).replace(/^(\.\.[\/\\])+/, '');
    var fileLoc = join(resolvedBase, safeSuffix);
    if (existsSync(fileLoc)) {
        request.staticFileExist = true;
        const data = readFileSync(fileLoc);
        if (!data) {
            response.writeHead(404, 'Not Found');
            response.write('404: File Not Found!');
            return response.end();
        } else {
            response.statusCode = 200;
            response.write(data);
            return response.end();
        }
    }

}

export function createAppServer(requests: any, port: number) {

    generateMethodSpec(requests);

    const server = createServer(async (request: Request, response: ServerResponse) => {
        try {
            request.startAt = new Date();
            SessionsManager.createIfNotExistsNewSession(request, response);
            response.setHeader('x-powered-by', 'Sustain Server');
            response.setHeader('Access-Control-Allow-Origin', '*');
            let body = await prepareBody(request, response);
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
                try {
                    serveStatic('./dist', request, response);
                    serveStatic('./static-files', request, response);
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
                let endTime: any = new Date();

                let timeDiff: any = endTime - request.startAt; //in ms

                console.log(`\x1b[32m${request.method} ${request.url}\x1b[0m `, `${response.statusCode}`, "in ", timeDiff, "ms");
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


async function prepareBody(request: any, response: any) {
    let body: any = [];
    if (request.method === RequestMethod.POST) {
        return await new Promise((resolve, reject) => {
            request.on('data', (chunk: any) => {
                body.push(chunk);
            }).on('end', () => {
                body = Buffer.concat(body).toString();
                if (request.headers['content-type'] == ContentType.APPLICATION_JSON) {
                    try {
                        body = JSON.parse(body.replace(/\\/g, ""));
                    } catch (error) {
                        response.statusCode = 500;
                        response.end(error.toString())
                        response.destroy();
                    }
                }
                resolve(body);
            }).on('error', (error: any) => {
                console.log("server -> error", error)
                reject()
            });
        });
    }
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
            console.log(err);
        }
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
                methodArgs[Number(arg_index)] = SessionsManager.getSession(assets.request);
                break;
            case RouteParamtypes.HEADERS:
                methodArgs[Number(arg_index)] = assets.request.headers;
                break;
            case RouteParamtypes.BODY:
                let askedBody;
                if (additionalData) {
                    askedBody = assets.body[additionalData];
                } else {
                    askedBody = assets.body;
                }
                methodArgs[Number(arg_index)] = askedBody;
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