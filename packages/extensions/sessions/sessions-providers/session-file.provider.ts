import { existsSync, readFileSync, writeFileSync } from "fs";
import { SESSION_FILE_PATH } from "../src/constants";

export class SessionFileProvider {
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