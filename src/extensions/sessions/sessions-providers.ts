import { SessionsProviders } from "../../constants";
import { Injectable } from "../../core/di";
import { SessionFileProvider } from "./sessions-providers/session-file.provider";
import { SessionMongoProvider } from "./sessions-providers/session-mongo.provider";

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
