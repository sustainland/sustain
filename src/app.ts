
import HelloController from './controllers/hello.controller';
import { bootstrap } from './core/bootstrap';

const app = {
    controllers: [HelloController]
}
bootstrap(app);



