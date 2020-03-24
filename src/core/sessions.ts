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
        console.log("SessionManager -> getSession -> idSession", idSession)
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
            console.log(key, value)
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
        console.log("SessionManager -> getCookies -> cookies", cookies)
        return cookies;
    };

    /**
     * TODO : add config option to customize Expires date and domain ....
     * @param request 
     * @param response 
     */
    createIfNotExistsNewSession(request: any, response: any, option?: any) {
        console.log('createIfNotExistsNewSession');
        if (!this.getIdSessionFromCookies(request)) {
            const ids = uniqueID();
            console.log("SessionManager -> createIfNotExistsNewSession -> ids", ids)
            response.setHeader('Set-Cookie', [`${this.SESSION_ID}=${ids}; Path=/ ;`]);
            this.setSession(ids, {})
        }
    }


}
InjectedContainer.addProvider({ provide: SessionManager, useClass: SessionManager });
InjectedContainer.inject(SessionManager);