import { SessionsProviders, SESSION_FILE_PATH } from "../constants";
import { existsSync, read, readFileSync, writeFileSync } from "fs";

export default class SessionProviders {
    provider: SessionFileProvider | SessionMongoProvider;
    constructor(private providerType: SessionsProviders) {
        this.initiateProvider();
        console.log(this.provider);
    }

    initiateProvider(): any {
        switch (this.providerType) {
            case SessionsProviders.File:
                this.provider = new SessionFileProvider();
                break;

            case SessionsProviders.Mongo:
                this.provider = new SessionMongoProvider();
                break;
        }
    }



}


class SessionFileProvider {
    private fileContent: string;
    constructor() {
        if (existsSync(SESSION_FILE_PATH)) {
            this.fileContent = readFileSync(SESSION_FILE_PATH).toString();

        } else {
            writeFileSync(SESSION_FILE_PATH, '');
        }
    }
    save(content: string) {
        writeFileSync(SESSION_FILE_PATH, JSON.stringify(content));
    }

    load(): Object {
        try {
            const content = readFileSync(SESSION_FILE_PATH).toString()
            return JSON.parse(content);
        } catch (error) {
            return {}
        }
    }

}

class SessionMongoProvider {
    constructor() {

    }
    save(content: string) {

    }

    load() {

    }
}