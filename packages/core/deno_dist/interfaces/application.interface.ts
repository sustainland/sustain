import {StaticFolder} from './static-folder.interface.ts';
import {SustainExtension} from './sustain-extension.interface.ts';
import {Provider} from './provider.interface.ts';
import {Middleware} from './middleware.interface.ts';
import {Controller} from './controller.interface.ts';
import {Module} from './module.interface.ts';
export interface Application {
  modules?: Module[];
  controllers?: Controller[];
  middleswares?: Middleware[];
  providers?: Provider[];
  extensions?: SustainExtension[];
  staticFolders?: StaticFolder[];
  port: number;
}
