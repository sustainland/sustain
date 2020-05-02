import { Injectable } from './di/injectable';
@Injectable()
export class SustainContext {
    constructor() { }
    context: any = {}
    set(key: string, value: any) {
        this.context[key] = value;
    }

    get(key: string) {
        return this.context[key];
    }
}

