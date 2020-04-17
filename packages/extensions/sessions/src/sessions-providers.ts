import { SessionsProviders } from './constants';
import { SessionFileProvider } from "./sessions-providers/session-file.provider";
import { SessionMongoProvider } from "./sessions-providers/session-mongo.provider";
import { Injectable } from "@sustain/core";

@Injectable()
export class SessionProviders {
    provider: SessionFileProvider | SessionMongoProvider;
    constructor() { }

    initiateProvider(providerType: SessionsProviders): any {
        switch (providerType) {
            case SessionsProviders.File:
                this.provider = new SessionFileProvider();
                break;

            case SessionsProviders.Mongo:
                this.provider = new SessionMongoProvider();
                break;
        }
    }

}
