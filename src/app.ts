
import HelloController from './controllers/HelloController';
import { bootstrap } from './core/bootstrap';
import { SessionProviders } from './core/sessions-providers';
import { UserService } from './services/user.service';
import { LoggerService } from './services/logger.service';
import UserController from './controllers/UserController';
import BaseController from './controllers/BaseControlle';
import HttpController from './controllers/HttpController';
import { App } from './decorators/core/app.decorator';
import { SwaggerAPI } from './decorators/core/swagger.decorator';
import { Extensions } from './decorators/core/extensions.decorator';
import { SessionsProviders, ROOT_FOLDER } from './constants';

require('source-map-support').install();



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
    swagger: {
        enable: true
    }
})
@App({
    controllers: [
        HelloController,
        UserController,
        BaseController,
        HttpController
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



