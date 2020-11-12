import {InjectedContainer} from './../di/dependency-container';
let allControllers: any[] = [],
  allProviders: any[] = [],
  allExtensions: any[] = [],
  allStaticFolders: any[] = [];
export function getModuleMetaData(module: any) {
  const {MODULE_CONFIG} = module.prototype;
  let {controllers = [], providers = [], extensions = [], modules = [], staticFolders = []} = MODULE_CONFIG;

  allControllers = [...allControllers, ...controllers];
  allProviders = [...allProviders, ...providers];
  allExtensions = [...allExtensions, ...extensions];
  allStaticFolders = [...allStaticFolders, ...staticFolders];

  if (Array.isArray(modules)) {
    modules.forEach((childModule: any) => {
      getModuleMetaData(childModule);
    });
  }
}

export function getAllModuleMetaData(mainModule: any) {
  getModuleMetaData(mainModule);
  injectProvidersToRootContainer([...allProviders]);
  injectControllerToRootContainer([...allControllers]);

  return {
    controllers: allControllers,
    providers: allProviders,
    extensions: allExtensions,
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
  });
}
