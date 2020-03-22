import { SessionProviders } from "./sessions-providers";
import { SessionsProviders } from "../constants";
import { InjectedContainer } from "./container";
import { Injectable } from "./di";
import { uniqueID } from "../utils/unique-id.util";

InjectedContainer.addProvider({ provide: SessionProviders, useClass: SessionProviders });
InjectedContainer.inject(SessionProviders);
const SessionProvider = InjectedContainer.get(SessionProviders);
SessionProvider.initiateProvider(SessionsProviders.File);
@Injectable()
export class SessionManager {
    sessions: any = {};
    SESSION_ID: string = 'ids';
    constructor() {
        this.sessions = SessionProvider.provider.load();
    }
    getSession(request: any) {
        const idSession = this.getIdSessionFromCookies(request);
        if (this.sessions[idSession]) {
            return Object.assign({
                set(key: string, value: any) {
                    console.log(key, value)
                    this[key] = value;
                }
            }, this.sessions[idSession]);
        } else {
            return null
        }
    }

    set(key: string, value: any) {

    }
    setSession(idSession: string, data: any) {
        this.sessions[idSession] = data;
        SessionProvider.provider.save(this.sessions);
    }

    getIdSessionFromCookies(request: any): string {
        return this.getCookies(request)[this.SESSION_ID] || '';
    }

    getCookies(request: any) {
        var cookies: any = {};
        request.headers && request.headers.cookie && request.headers.cookie.split(';').forEach(function (cookie: any) {
            var parts = cookie.match(/(.*?)=(.*)$/)
            cookies[parts[1].trim()] = (parts[2] || '').trim();
        });
        return cookies;
    };

    /**
     * TODO : add config option to customize Expires date and domain ....
     * @param request 
     * @param response 
     */
    createIfNotExistsNewSession(request: any, response: any, option?: any) {

        if (!this.getIdSessionFromCookies(request)) {
            const ids = uniqueID();
            response.setHeader('Set-Cookie', [`${this.SESSION_ID}=${ids}; Path=/ ;`]);
            this.setSession(ids, {})
        }
    }


}
InjectedContainer.addProvider({ provide: SessionManager, useClass: SessionManager });
InjectedContainer.inject(SessionManager);