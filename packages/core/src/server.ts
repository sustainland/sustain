import {SustainExtension} from './interfaces/IExtension.interface';
import {InjectedContainer} from './di/dependency-container';
import {createServer, ServerResponse} from 'http';
import {ROUTE_ARGS_METADATA} from './constants';
import * as querystring from 'querystring';
import {generateMethodSpec} from '@sustain/common';
import {render404Page} from './helpers/render-error-pages.helper';
import {isArray} from 'util';
import {RouteParamtypes} from './enums/route-params.enum';
const yenv = require('yenv');
const env = yenv('sustain.yaml', {optionalKeys: ['domain', 'port']});
const serveStatic = require('@sustain/serve-static');

const {domain = 'localhost', port = 5002} = env;

const mode = process.env.NODE_ENV;

const exntensionContainer: any[] = [];

export function createAppServer(requests: any, config: any) {
  try {
    generateMethodSpec(requests, config);
  } catch (e) {
    console.log(e);
  }

  const {extensions, expressMiddlewares, staticFolders} = config;
  if (extensions.load && isArray(extensions.load)) {
    extensions.load.forEach((extension: SustainExtension) => {
      exntensionContainer.push(extension);
    });
  }

  const server = createServer(async (request: any, response: ServerResponse) => {
    try {
      exntensionContainer.forEach((extension: SustainExtension) => {
        if (extension.onResquestStartHook) {
          extension.onResquestStartHook(request, response);
        }
      });
      const middlewares = [];
      const staticFolderResolvers = [];
      for (let middleware of expressMiddlewares) {
        middlewares.push(
          new Promise(resolve => {
            return middleware(request, response, resolve);
          })
        );
      }

      for (const staticFolder of staticFolders) {
        staticFolderResolvers.push(
          new Promise(resolve => {
            return serveStatic(staticFolder.path, staticFolder.option || {})(request, response, resolve);
          })
        );
      }

      await Promise.all(middlewares).catch((e: Error) => {
        response.end(`${e.message}, ${e.stack}
                `);
        throw e;
      });

      response.setHeader('x-powered-by', 'Sustain Server');
      response.setHeader('Access-Control-Allow-Origin', '*');
      const route = requestSegmentMatch(requests, request);
      if (route) {
        if (route.interceptors) {
          await executeInterceptor(route, request, response);
        }
        const routeParamsHandler = Reflect.getMetadata(ROUTE_ARGS_METADATA, route.handler) || {};
        const methodArgs: any[] = fillMethodsArgs(routeParamsHandler, {request, response, body: request.body});
        const result = route.objectHanlder[route.functionHandler](...methodArgs);

        if (result instanceof Promise) {
          const output = await result;
          if (typeof output == 'object') {
            response.writeHead(200, {'Content-Type': 'application/json'});
            response.end(JSON.stringify(output));
          } else {
            response.end(await output);
          }
        } else if (typeof result == 'object') {
          response.writeHead(200, {'Content-Type': 'application/json'});
          response.end(JSON.stringify(result));
        } else {
          response.end(String(result));
        }
      } else {
        await Promise.all(staticFolderResolvers).catch((error: Error) => {
          response.end(`${error.message}, ${error.stack}`);
          throw error;
        });

        throw new Error('Not Found');
      }

      response.on('error', (error: any) => {
        console.log(error);
      });
      response.on('finish', () => {
        // TODO: move this to log extension
        exntensionContainer.forEach((extension: any) => {
          if (extension.onResponseEndHook) {
            extension.onResponseEndHook(request, response);
          }
        });
      });
    } catch (error) {
      console.error(error);

      render404Page(response, error);
      exntensionContainer.forEach((extension: any) => {
        if (extension.onResponseEndHook) {
          extension.onResponseEndHook(request, response);
        }
      });
    }
  });
  server.listen(config.port).on('listening', () => {
    console.log('\x1b[32m%s\x1b[0m', ' App is running', `at ${domain}:${port} in ${mode} mode`);
    console.log(' Press CTRL-C to stop\n');
  });
  server.on('error', (error: Error) => {
    console.log(999);
  });
  return server;
}

async function executeInterceptor(route: any, request: any, response: any) {
  const callstack = [];
  if (
    route.objectHanlder.config &&
    route.objectHanlder.config.interceptors &&
    Array.isArray(route.objectHanlder.config.interceptors)
  ) {
    for (let controllerInterceptor of route.objectHanlder.config.interceptors) {
      const intercept = InjectedContainer.get(controllerInterceptor).intercept;
      const routeParamsHandler = Reflect.getMetadata(ROUTE_ARGS_METADATA, intercept) || {};
      const interception = new Promise(resolve => {
        const methodArgs: any[] = fillMethodsArgs(routeParamsHandler, {request, response, resolve});
        if (!intercept) {
          throw new Error('Invalid Interceptor : ' + controllerInterceptor.name);
        }
        return intercept(...methodArgs);
      });
      callstack.push(interception);
    }
  }
  for (let interceptor of route.interceptors) {
    const intercept = InjectedContainer.get(interceptor).intercept;
    const routeParamsHandler = Reflect.getMetadata(ROUTE_ARGS_METADATA, intercept) || {};
    const interception = new Promise(resolve => {
      const methodArgs: any[] = fillMethodsArgs(routeParamsHandler, {request, response, resolve});
      if (!intercept) {
        throw new Error('Invalid Interceptor : ' + interceptor.name);
      }
      return intercept(...methodArgs);
    });
    callstack.push(interception);
  }
  return Promise.all(callstack).catch((e: Error) => {
    response.end(`${e.message}, ${e.stack}
            `);
    throw e;
  });
}

function requestSegmentMatch(requests: any, request: any) {
  return requests[request.method].find((route: any) => {
    const requestRouteDetails = route.path.match(request.url.split('?')[0]);
    if (requestRouteDetails) {
      request.params = requestRouteDetails.params;
      return true;
    }
  });
}

function fillMethodsArgs(routeParamsHandler: any, assets: any) {
  const methodArgs: any[] = [];
  Object.keys(routeParamsHandler).forEach(args => {
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
        const query = querystring.parse(assets.request.url.split('?')[1]);
        let askedQuery = {};
        if (additionalData) {
          askedQuery = query[additionalData];
        } else {
          askedQuery = {...query};
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
