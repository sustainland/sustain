
import HelloController from './controllers/hello.controller';
import { bootstrap } from './core/bootstrap';
import { SessionProviders } from './core/sessions-providers';
import { UserService } from './services/user.service';
import { LoggerService } from './services/logger.service';
import UserController from './controllers/user.controller';

require('source-map-support').install();


const app = {
    controllers: [
        HelloController,
        UserController
    ],
    providers: [
        LoggerService,
        UserService,
        SessionProviders,
        UserController,
        HelloController
    ]
}
/**
 * Bootstrap the application
 */
bootstrap(app);



