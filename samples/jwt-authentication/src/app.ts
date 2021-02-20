import {UserModule} from './modules/users/UserModule';
import {AuthModule} from './modules/auth/AuthModule';
import {HelloService} from './services/HelloService';
import {App, bootstrap, RequestLoggerExtension} from '@sustain/core';
import {SwaggerModule} from '@sustain/swagger';
import BaseController from './controllers/BaseController';

require('source-map-support').install();

const bodyParser = require('@sustain/body-parser');
@App({
  modules: [SwaggerModule, AuthModule, UserModule],
  controllers: [BaseController],
  middleswares: [bodyParser.json()],
  providers: [HelloService],
  extensions: [RequestLoggerExtension],
  staticFolders: [{path: 'public'}],
})
class AppModule {}

/**
 * Bootstrap the application
 */
bootstrap(AppModule);
