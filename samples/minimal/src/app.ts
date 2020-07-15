import { App, bootstrap, Controller } from '@sustain/core';
import { Get, Extensions } from '@sustain/common';

@Controller()
export default class HelloController {
    constructor() { }

    @Get()
    hello(): string {
        return `Hello Sustainers`;
    }
}
@Extensions({})
@App({
    controllers: [
        HelloController,
    ],
    port: process.env.PORT || 5002,
    staticFolders: []
})
class AppModule { }

/**
 * Bootstrap the application
 */
module.exports = bootstrap(AppModule);



