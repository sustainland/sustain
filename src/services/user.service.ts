import { Injectable } from "../core/di";
import { LoggerService } from "./logger.service";

@Injectable()
export class SomeService2 {
    constructor(private loggerService: LoggerService) {

    }
    get() {
        this.loggerService.error('-----errrooorrrr');
    }
}

