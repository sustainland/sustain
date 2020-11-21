import {AuthModule} from './modules/auth/AuthModule';
import {HelloService} from './services/HelloService';
import {App, bootstrap} from '@sustain/core';
import {SwaggerModule} from '@sustain/swagger';
import BaseController from './controllers/BaseController';
require('source-map-support').install();

const bodyParser = require('@sustain/body-parser');

@App({
  modules: [SwaggerModule, AuthModule],
  controllers: [BaseController],
  middleswares: [bodyParser.json()],
  providers: [HelloService],
  extensions: [],
  port: process.env.PORT || 5002,
  staticFolders: [{path: 'public'}],
})
class AppModule {}

/**
 * Bootstrap the application
 */
module.exports = bootstrap(AppModule);
