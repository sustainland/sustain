import { SwaggerAPI, SWAGGER_FOLDER } from '@sustain/common';

import { UserService } from './services/user.service';
import { LoggerService } from './services/logger.service';
import BaseController from './controllers/BaseController';
import PlayerController from './controllers/PlayerController';
import { SessionsProviders, ROOT_FOLDER } from './constants';
import { Extensions } from '@sustain/common';
import { App, bootstrap } from '@sustain/core';
import { DatabaseProvider } from './database.provider'
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
        BaseController,
        DatabaseProvider,
        PlayerController,

    ],
    providers: [
        LoggerService,
        UserService,
        // SessionProviders,
    ],
    port: process.env.PORT || 5002,
    staticFolder: [
        SWAGGER_FOLDER,
        ROOT_FOLDER,
    ]
})
class AppModule { }


/**
 * Bootstrap the application
 */
module.exports = bootstrap(AppModule);



