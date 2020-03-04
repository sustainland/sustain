
import HelloController from './controllers/hello.controller';
import { bootstrap } from './core/bootstrap';
import { SessionProviders } from './core/sessions-providers';
import { UserService } from './services/user.service';
import { LoggerService } from './services/logger.service';
import UserController from './controllers/user.controller';
import BaseController from './controllers/base.controlle';

require('source-map-support').install();


const app = {
    controllers: [
        HelloController,
        UserController,
        BaseController
    ],
    providers: [
        LoggerService,
        UserService,
        SessionProviders,
        UserController,
        HelloController
    ],
    port : 5002
}
/**
 * Bootstrap the application
 */
bootstrap(app);



