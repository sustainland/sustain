import { SwaggerAPI, SWAGGER_FOLDER } from '@sustain/common';

import HelloController from './controllers/HelloController';
import { UserService } from './services/user.service';
import { LoggerService } from './services/logger.service';
import UserController from './controllers/UserController';
import BaseController from './controllers/BaseController';
import HttpController from './controllers/HttpController';
import { SessionsProviders, ROOT_FOLDER } from './constants';
import { Extensions } from '@sustain/common';
import { App, bootstrap } from '@sustain/core';
require('source-map-support').install();

// using body-parser for demo purpose, that we can use expressjs ecosystem
const bodyParser = require('@sustain/body-parser');

@SwaggerAPI({
    info: {
        title: "Sustain API",
        version: "1.0.0",
        description: "Generated with `Sustain`"
    },
    swagger: "2.0",
})
@Extensions({
    session: {
        provider: SessionsProviders.File
    },
    load: [
        // SessionManager,
        // RequestLoggerExtension
    ],
    // swagger: {
    //     enable: true
    // },
    expressMiddlewares: [
        bodyParser.json()
    ]

})
@App({
    controllers: [
        HelloController,
        UserController,
        BaseController,
        HttpController,
    ],
    providers: [
        LoggerService,
        UserService,
        UserController,
        HelloController,
    ],
    port: process.env.PORT || 5002,
    staticFolders: [
        SWAGGER_FOLDER,
        ROOT_FOLDER,
    ]
})
class AppModule { }

/**
 * Bootstrap the application
 */
module.exports = bootstrap(AppModule);



