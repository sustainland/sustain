import { SessionProviders } from "./sessions-providers";
import { SessionsProviders } from "../constants";
import { InjectedContainer } from "./container";
import { Injectable } from "./di";
import { uniqueID } from "../utils/unique-id.util";

InjectedContainer.addProvider({ provide: SessionProviders, useClass: SessionProviders });
InjectedContainer.inject(SessionProviders);
const SessionProvider = InjectedContainer.get(SessionProviders);
@Injectable()
export class SessionManager {
    sessions: any = {};
    SESSION_ID: string = 'ids';
    constructor() {
    }
    loadProvider() {
        this.sessions = SessionProvider.provider.load();
    }
    getSession(request: any) {
        const idSession = this.getIdSessionFromCookies(request);
        if (this.sessions[idSession]) {
            request.idSession = idSession;
            request.sessions = this.sessions[idSession];
            return Object.assign({}, this.sessions[idSession]);
        } else {
            return {}
        }
    }

    setKey(idSession: string, sessions: any) {
        return (key: any, value: any) => {
            this.sessions[idSession][key] = value;
            sessions = this.sessions[idSession];
            SessionProvider.provider.save(this.sessions);
        }
    }

    getKey(idSession: string, sessions: any) {
        return (key: any) => {

            return key ? this.sessions[idSession][key] : this.sessions[idSession];
        }
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