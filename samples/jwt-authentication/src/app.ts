import {AuthModule} from './modules/auth/AuthModule';
import {SwaggerAPI} from '@sustain/common';
import {HelloService} from './services/HelloService';
import {App, bootstrap, SwaggerModule, RequestLoggerExtension} from '@sustain/core';
import BaseController from './controllers/BaseController';
require('source-map-support').install();

const bodyParser = require('@sustain/body-parser');

@SwaggerAPI({
  info: {
    title: 'Sustain API',
    version: '1.0.0',
    description: 'Generated with `Sustain`',
  },
  swagger: '2.0',
})
@App({
  modules: [SwaggerModule, AuthModule],
  controllers: [BaseController],
  middleswares: [bodyParser.json()],
  providers: [HelloService],
  extensions: [RequestLoggerExtension],
  port: process.env.PORT || 5002,
  staticFolders: [{path: 'public'}],
})
class AppModule {}

/**
 * Bootstrap the application
 */
module.exports = bootstrap(AppModule);
