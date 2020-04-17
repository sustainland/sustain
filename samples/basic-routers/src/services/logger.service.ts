import { Injectable } from "@sustain/core";

@Injectable()
export class LoggerService {
    constructor() { }
    error(errorText: string) {
        console.log('\x1b[31m%s\x1b[0m', errorText);  //cyan

        // console.log('+++++++++++++errorText: ', errorText);

    }
}

