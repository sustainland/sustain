import {Module} from './../interfaces/module.interface';
import {InjectedContainer} from './../di/dependency-container';
let allControllers: any[] = [],
  allProviders: any[] = [],
  allExtensions: any[] = [],
  allStaticFolders: any[] = [],
  allMiddleswares: any[] = [],
  allModules: any[] = [];
export const getModuleMetaData = (module: any) => {
  const {MODULE_CONFIG} = module.prototype;
  let {
    controllers = [],
    providers = [],
    extensions = [],
    modules = [],
    staticFolders = [],
    middleswares = [],
  } = MODULE_CONFIG;

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

export const getAllModuleMetaData = (mainModule: any) => {
  getModuleMetaData(mainModule);
  return {
    controllers: allControllers,
    providers: allProviders,
    extensions: allExtensions,
    middleswares: allMiddleswares,
    staticFolders: allStaticFolders,
    modules : allModules
  };
};
const injectControllerToRootContainer = (elements: any[] = []) => {
  elements.forEach((element: any) => {
    InjectedContainer.inject(element);
  });
};

const injectProvidersToRootContainer = (elements: any[] = []) => {
  elements.forEach((element: any) => {
    InjectedContainer.addProvider({provide: element, useClass: element});
    InjectedContainer.inject(element);
  });
};
const executeOnModuleLoaded = (module: Module) => {
  InjectedContainer.inject(module);
  const instance = InjectedContainer.get(module);
  if (instance.onModuleLoaded) {
    instance.onModuleLoaded();
  }
};

export const executeOnServerStart = (modules: Module[], applicationRequests: any) => {
  modules.forEach((module: Module) => {
    InjectedContainer.inject(module);
    const instance = InjectedContainer.get(module);
    if (instance.onServerStart) {
      instance.onServerStart(applicationRequests);
    }
  });
};
