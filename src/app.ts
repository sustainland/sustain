
import HelloController from './controllers/hello.controller';
import { bootstrap } from './core/bootstrap';
import { SessionProviders } from './core/sessions-providers';
import { UserService } from './services/user.service';
import { LoggerService } from './services/logger.service';
import UserController from './controllers/user.controller';
import BaseController from './controllers/base.controlle';
import HttpController from './controllers/HttpController';

require('source-map-support').install();


const app = {
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
        'swagger-ui',
        ''
    ]
}
/**
 * Bootstrap the application
 */
module.exports = bootstrap(app);



