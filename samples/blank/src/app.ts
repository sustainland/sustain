import {
    SwaggerAPI,
    SWAGGER_FOLDER
} from '@sustain/common';

import HelloController from './controllers/HelloController';
import { HelloService } from './services/hello.service';
import { ROOT_FOLDER } from './constants';
import { App, bootstrap } from '@sustain/core';
import { Extensions } from '@sustain/common';
import BaseController from './controllers/BaseController';
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
    swagger: {
        enabled: true
    },
    expressMiddlewares: [
        bodyParser.json()
    ]
})
@App({
    controllers: [
        HelloController,
        BaseController
    ],
    providers: [
        HelloService,
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



