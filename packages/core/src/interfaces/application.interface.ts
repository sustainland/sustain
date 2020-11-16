import {StaticFolder} from './static-folder.interface';
import {SustainExtension} from './sustain-extension.interface';
import {Provider} from './provider.interface';
import {Middleware} from './middleware.interface';
import {Controller} from './controller.interface';
import {Module} from './module.interface';
export interface Application {
  modules?: Module[];
  controllers?: Controller[];
  middleswares?: Middleware[];
  providers?: Provider[];
  extensions?: SustainExtension[];
  staticFolders?: StaticFolder[];
  port: number;
}
