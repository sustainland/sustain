import {Route} from './interfaces/route';
import {SustainRequest} from './interfaces/sustain-request.interface';
import {Application} from './interfaces/application.interface';
import {Middleware} from './interfaces/middleware.interface';
import {StaticFolder} from './interfaces/static-folder.interface';
import {SustainExtension} from './interfaces/sustain-extension.interface';
import {InjectedContainer} from './di/dependency-container';
import {createServer, ServerResponse, Server} from 'http';
import {ROUTE_ARGS_METADATA, DEFAULT_PORT, DEFAULT_HOST} from './constants';
import * as querystring from 'querystring';
import {renderErrorPage} from './helpers/render-error-pages.helper';
import {RouteParamtypes} from './enums/route-params.enum';
const serveStatic = require('@sustain/serve-static');
const yamlconfig = require('@sustain/config');
const {domain = DEFAULT_HOST, port = DEFAULT_PORT} = yamlconfig;

const mode = process.env.NODE_ENV;

export class SustainServer {
  requests: SustainRequest;
  config: Application;
  extensions: SustainExtension[] = [];
  staticFolders: StaticFolder[] = [];
  middleswares: Middleware[] = [];
  loadedExtensions: SustainExtension[] = [];
  server: Server;
  port: number;
  constructor(requests: SustainRequest, config: Application) {
    this.requests = requests;
    this.config = config;
    this.port = this.config?.port || port;
    const {extensions = [], staticFolders = [], middleswares = []} = this.config;
    this.extensions = this.loadInjectedExtension(extensions);
    this.staticFolders = staticFolders;
    this.middleswares = middleswares;
    this.generateOpenApiSchema();
    this.create();
  }

  loadInjectedExtension(extensions: SustainExtension[]) {
    return extensions.map((extension: SustainExtension) => InjectedContainer.get(extension));
  }

  nextifyMiddleware(middleware: any, request: any, responce: ServerResponse) {
    return new Promise(next => {
      return middleware(request, responce, next);
    });
  }

  create() {
    this.server = createServer(async (request: any, response: ServerResponse) => {
      try {
        this.setPoweredByHeader(response);
        response.on('finish', () => {
          this.extensions.forEach((extension: SustainExtension) => {
            if (extension.onResponseEndHook) {
              extension.onResponseEndHook(request, response);
            }
          });
        });

        this.extensions.forEach((extension: SustainExtension) => {
          if (extension.onResquestStartHook) {
            extension.onResquestStartHook(request, response);
          }
        });
        for (const middlesware of this.middleswares) {
          await this.nextifyMiddleware(middlesware, request, response);
        }

        const route = requestSegmentMatch(this.requests, request);
        if (route) {
          if (route.interceptors || route.objectHanlder?.config) {
            await this.executeInterceptor(route, request, response);
          }
          const routeParamsHandler = Reflect.getMetadata(ROUTE_ARGS_METADATA, route.handler) || {};
          const methodArgs: any[] = fillMethodsArgs(routeParamsHandler, {request, response, body: request.body});
          const controllerOutput = route.objectHanlder[route.functionHandler](...methodArgs);
          await this.handleControllerOutput(controllerOutput, response);
        } else {
          for (const folder of this.staticFolders) {
            await this.nextifyMiddleware(serveStatic(folder.path, folder.option), request, response);
          }
          response.statusCode = 404;
          throw new Error('Not Found');
        }
      } catch (error) {
        // catch all error;
        renderErrorPage(response, error);
        console.error(error);
      }
    })
      .listen(this.port)
      .on('listening', () => {
        console.log('\x1b[32m%s\x1b[0m', ' App is running', `at ${domain}:${this.port} in ${yamlconfig.envId} mode`);
        console.log(' Press CTRL-C to stop\n');
      });
  }

  generateOpenApiSchema(): void {
    //generateMethodSpec(this.requests, this.config);
  }

  async handleControllerOutput(controllerOutput: Promise<any> | string | number | object, response: ServerResponse) {
    if (controllerOutput instanceof Promise) {
      const output = await controllerOutput;
      if (typeof output == 'object') {
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(JSON.stringify(output));
      } else {
        response.end(await output);
      }
    } else if (typeof controllerOutput == 'object') {
      response.writeHead(200, {'Content-Type': 'application/json'});
      response.end(JSON.stringify(controllerOutput));
    } else {
      response.end(String(controllerOutput));
    }
  }

  async executeInterceptor(route: Route, request: any, response: ServerResponse) {
    const callstack = [];
    if (
      route.objectHanlder.config &&
      route.objectHanlder.config.interceptors &&
      Array.isArray(route.objectHanlder.config.interceptors)
    ) {
      // TODO: merge the route and controller inteceptor mecanisme
      for (let controllerInterceptor of route.objectHanlder.config.interceptors) {
        const interceptor = InjectedContainer.get(controllerInterceptor);
        const routeParamsHandler = Reflect.getMetadata(ROUTE_ARGS_METADATA, interceptor.intercept) || {};
        const interception = new Promise(resolve => {
          const methodArgs: any[] = fillMethodsArgs(routeParamsHandler, {request, response, resolve});
          if (!interceptor.intercept) {
            throw new Error('Invalid Interceptor : ' + controllerInterceptor.name);
          }
          return interceptor.intercept(...methodArgs);
        });
        callstack.push(interception);
      }
    }
    for (let routeInterceptor of route.interceptors || []) {
      const interceptor = InjectedContainer.get(routeInterceptor);
      const routeParamsHandler = Reflect.getMetadata(ROUTE_ARGS_METADATA, interceptor.intercept) || {};
      const interception = new Promise(resolve => {
        const methodArgs: any[] = fillMethodsArgs(routeParamsHandler, {request, response, resolve});
        if (!interceptor.intercept) {
          throw new Error('Invalid Interceptor : ' + routeInterceptor.name);
        }
        return interceptor.intercept(...methodArgs);
      });
      callstack.push(interception);
    }
    return Promise.all(callstack).catch((e: Error) => {
      response.end(`${e.message}, ${e.stack}
            `);
      throw e;
    });
  }

  setPoweredByHeader(response: ServerResponse) {
    response.setHeader('x-powered-by', 'Sustain Server');
    response.setHeader('Access-Control-Allow-Origin', '*');
  }
}

function requestSegmentMatch(requests: SustainRequest, request: any) {
  return requests[request.method].find((route: Route) => {
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
