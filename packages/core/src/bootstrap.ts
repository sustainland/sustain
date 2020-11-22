import {Application} from './interfaces/application.interface';
import {DEFAULT_PORT} from './constants';
import {SustainServer} from './server';
import {getAllModuleMetaData, executeOnServerStart} from './utils/module.helper';
import {loadControllers} from './utils/http-request.helper';

class BootstrapFramework {
  application: Application;
  mainModuleMetaData: any;
  applicationRequests: any;
  constructor(app: any) {
    this.application = app;
    this.mainModuleMetaData = getAllModuleMetaData(this.application);

    const {controllers, modules} = this.mainModuleMetaData;

    this.applicationRequests = loadControllers(controllers);
    executeOnServerStart(modules, this.applicationRequests);
    this.bootServer(this.applicationRequests, this.mainModuleMetaData);
  }

  bootServer(requests: any, mainModuleMetaData: any) {
    const {port, staticFolders = [], extensions = {}, middleswares = []} = mainModuleMetaData;

    new SustainServer(requests, {
      port: port || DEFAULT_PORT,
      staticFolders,
      extensions,
      middleswares,
    });
  }
}
/**
 * Boostratp the Application
 * @param app
 */
export function bootstrap(app: any): any {
  new BootstrapFramework(app);
}
