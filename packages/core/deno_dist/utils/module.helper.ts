import {Module} from './../interfaces/module.interface.ts';
import {DependencyContainer, InjectedContainer} from './../di/dependency-container.ts';
let usedInjectedContainer = InjectedContainer;
let allControllers: any[] = [],
  allProviders: any[] = [],
  allExtensions: any[] = [],
  allStaticFolders: any[] = [],
  allMiddleswares: any[] = [],
  allModules: any[] = [],
  applicationPort: number;
export const getModuleMetaData = (module: any, config?: {mainModule: boolean}) => {
  const {MODULE_CONFIG} = module.prototype;
  let {
    controllers = [],
    providers = [],
    extensions = [],
    modules = [],
    staticFolders = [],
    middleswares = [],
    port,
  } = MODULE_CONFIG;

  if (config?.mainModule) {
    applicationPort = port;
  }

  allControllers = [...allControllers, ...controllers];
  allProviders = [...allProviders, ...providers];
  allExtensions = [...allExtensions, ...extensions];
  allStaticFolders = [...allStaticFolders, ...staticFolders];
  allMiddleswares = [...allMiddleswares, ...middleswares];
  allModules = [...allModules, module];
  injectProvidersToRootContainer([...providers]);
  injectControllerToRootContainer([...extensions, ...controllers]);
  if (Array.isArray(modules)) {
    for (const childModule of modules) {
      getModuleMetaData(childModule);
    }
  }
  executeOnModuleLoaded(module);
};

export const getAllModuleMetaData = (mainModule: any, params?: {scoped: boolean; container: DependencyContainer}) => {
  if (params?.scoped) {
    usedInjectedContainer = params.container;
  }
  getModuleMetaData(mainModule, {mainModule: true});
  return {
    controllers: allControllers,
    providers: allProviders,
    extensions: allExtensions,
    middleswares: allMiddleswares,
    staticFolders: allStaticFolders,
    modules: allModules,
    port: applicationPort,
  };
};
const injectControllerToRootContainer = (elements: any[] = []) => {
  elements.forEach((element: any) => {
    usedInjectedContainer.inject(element);
  });
};

const injectProvidersToRootContainer = (elements: any[] = []) => {
  elements.forEach((element: any) => {
    usedInjectedContainer.addProvider({provide: element, useClass: element});
    usedInjectedContainer.inject(element);
  });
};
const executeOnModuleLoaded = (module: Module) => {
  usedInjectedContainer.inject(module);
  const instance = usedInjectedContainer.get(module);
  if (instance.onModuleLoaded) {
    instance.onModuleLoaded();
  }
};

export const executeOnServerStart = (modules: Module[], applicationRequests: any) => {
  modules.forEach((module: Module) => {
    usedInjectedContainer.inject(module);
    const instance = usedInjectedContainer.get(module);
    if (instance.onServerStart) {
      instance.onServerStart(applicationRequests);
    }
  });
};
