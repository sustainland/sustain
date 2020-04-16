
import HelloController from './controllers/HelloController';
import { bootstrap } from '../packages/core/bootstrap';
import { SessionProviders } from './extensions/sessions/sessions-providers';
import { UserService } from './services/user.service';
import { LoggerService } from './services/logger.service';
import UserController from './controllers/UserController';
import BaseController from './controllers/BaseController';
import HttpController from './controllers/HttpController';
import PlayerController from './controllers/PlayerController';
import { App } from '../packages/common/decorators/app.decorator';
import { SwaggerAPI } from '../packages/common/decorators/swagger.decorator';
import { Extensions } from '../packages/common/decorators/extensions.decorator';
import { SessionsProviders, ROOT_FOLDER } from './constants';
import { SessionManager } from '../packages/core';
import { RequestLoggerExtension } from './extensions/request-logger/request-logger.extension';

require('source-map-support').install();

// using body-parser for demo purpose, that we can use expressjs ecosystem
const bodyParser = require('body-parser')

@SwaggerAPI({
    info: {
        title: "Sustain API",
        version: "1.0.0",
        description: "Generated with `Sustain`"
    },
    swagger: "2.0",
    schemes: [
        "http"
    ],
})
@Extensions({
    session: {
        provider: SessionsProviders.File
    },
    load: [
        SessionManager,
        RequestLoggerExtension
    ],
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
        PlayerController
    ],
    providers: [
        LoggerService,
        UserService,
        SessionProviders,
        UserController,
        HelloController
    ],
    port: process.env.PORT || 5002,
    staticFolder: [
        ROOT_FOLDER
    ]
})
class AppModule { }

/**
 * Bootstrap the application
 */
module.exports = bootstrap(AppModule);



