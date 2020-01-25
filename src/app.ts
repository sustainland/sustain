
import HelloController from './controllers/hello.controller';
import { bootstrap } from './core/bootstrap';
require('source-map-support').install();

const app = {
    controllers: [HelloController]
}
bootstrap(app);



