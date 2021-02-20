import {HelloController} from './controllers/HelloController';
import {HelloService} from './services/HelloService';
import {App, bootstrap, RequestLoggerExtension} from '@sustain/core';
import {BaseController} from './controllers/BaseController';

require('source-map-support').install();

@App({
  controllers: [HelloController, BaseController],
  middleswares: [require('@sustain/body-parser').json()],
  providers: [HelloService],
  extensions: [RequestLoggerExtension],
  staticFolders: [{path: 'public'}],
})
class AppModule {}

/**
 * Bootstrap the application
 */
bootstrap(AppModule);
