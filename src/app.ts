
import HelloController from './controllers/hello.controller';
import { bootstrap } from './core/bootstrap';
import { InjectedContainer } from './core/container';
import { SessionProviders } from './core/sessions-providers';
import { Container, Injectable, InjectionToken, Inject } from './core/di';
import { UserService } from './services/user.service';
import { LoggerService } from './services/logger.service';
import UserController from './controllers/user.controller';
// import { SessionFileProvider } from './core/sessions-providers';
require('source-map-support').install();

export const API_TOKEN = new InjectionToken('api-token');

// @Injectable()
// export class SomeService {
//     constructor(@Inject(API_TOKEN) api: any) { }
//     get() {
//         console.log('hello from SomeService');
//     }
// }

// @Injectable()
// export class InjectableClass {
//     constructor(private someService: SomeService, @Inject(API_TOKEN) token: any) {
//         console.log('constructor: InjectableClass');

//         console.log(token);
//         console.log('this.someService', this.someService);
//         // console.log('someService: ', someService);
//         // console.log('someService.get(): ', someService.get());
//     }
//     get() {
//         this.someService.get()
//     }
// }

// InjectedContainer.addProvider({ provide: InjectableClass, useClass: InjectableClass });

// InjectedContainer.addProvider({ provide: SomeService, useClass: SomeService });
// InjectedContainer.addProvider({ provide: API_TOKEN, useValue: 'https://some-url.com' });
// InjectedContainer.addProvider({ provide: SomeService2, useClass: SomeService2 });


// InjectedContainer.inject(InjectableClass);


const services = [LoggerService, UserService, SessionProviders, UserController, HelloController]
services.forEach(service => {
    InjectedContainer.addProvider({ provide: service, useClass: service });
    InjectedContainer.inject(service);

});



const app = {
    controllers: [HelloController, UserController]
}
bootstrap(app);



