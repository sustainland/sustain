import {InjectedContainer} from './../di/dependency-container';
let allControllers: any[] = [],
  allProviders: any[] = [],
  allExtensions: any[] = [],
  allStaticFolders: any[] = [],
  allMiddleswares: any[] = [];
export function getModuleMetaData(module: any) {
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

  if (Array.isArray(modules)) {
    modules.forEach((childModule: any) => {
      getModuleMetaData(childModule);
    });
  }
}

export function getAllModuleMetaData(mainModule: any) {
  getModuleMetaData(mainModule);
  injectProvidersToRootContainer([...allProviders]);
  injectControllerToRootContainer([...allExtensions, ...allControllers]);

  return {
    controllers: allControllers,
    providers: allProviders,
    extensions: allExtensions,
    middleswares: allMiddleswares,
    staticFolders: allStaticFolders,
  };
}
function injectControllerToRootContainer(elements: any[] = []) {
  elements.forEach((element: any) => {
    InjectedContainer.inject(element);
  });
}

function injectProvidersToRootContainer(elements: any[] = []) {
  elements.forEach((element: any) => {
    InjectedContainer.addProvider({provide: element, useClass: element});
    InjectedContainer.inject(element);
  });
}
