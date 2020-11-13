import {SustainServer} from './server';
import {getAllModuleMetaData} from './utils/module.helper';
import {loadControllers} from './utils/http-request.helper';
import {DEFAULT_PORT} from './constants';

class BootstrapFramework {
  application: any;
  mainModuleMetaData: any;
  applicationRequests: any;
  constructor(app: any) {
    this.application = app;
    this.mainModuleMetaData = getAllModuleMetaData(this.application);

    const {controllers} = this.mainModuleMetaData;

    this.applicationRequests = loadControllers(controllers);

    this.bootServer(this.applicationRequests, this.mainModuleMetaData);
  }

  bootServer(requests: any, mainModuleMetaData: any) {
    const {port, staticFolders = [], swaggerConfig, extensions = {}, middleswares = []} = mainModuleMetaData;

    new SustainServer(requests, {
      port: port || DEFAULT_PORT,
      staticFolders,
      swaggerConfig,
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
