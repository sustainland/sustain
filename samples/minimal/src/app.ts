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
@App({
    controllers: [
        HelloController,
    ],
    port: process.env.PORT || 5002
})
class AppModule { }

/**
 * Bootstrap the application
 */
module.exports = bootstrap(AppModule);



