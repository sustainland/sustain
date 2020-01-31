import { SessionProviders } from "./sessions-providers";
import { SessionsProviders } from "../constants";
import { InjectedContainer } from "./container";
import { Injectable } from "./di";

InjectedContainer.addProvider({ provide: SessionProviders, useClass: SessionProviders });
InjectedContainer.inject(SessionProviders);
const SessionProvider = InjectedContainer.get(SessionProviders);
SessionProvider.initiateProvider(SessionsProviders.File);
@Injectable()
export class SessionManager {
    sessions: any = {};
    constructor() {
        this.sessions = SessionProvider.provider.load();
    }
    getSession(request: any) {
        const idSession = this.getIdSessionFromCookies(request);
        if (this.sessions[idSession]) {
            return Object.assign({}, this.sessions[idSession]);
        } else {
            return null
        }
    }
    setSession(idSession: string, data: any) {
        this.sessions[idSession] = data;
        SessionProvider.provider.save(this.sessions);
    }

    getIdSessionFromCookies(request: any): string {
        return this.getCookies(request)['ids'] || '';
    }

    getCookies(request: any) {
        var cookies: any = {};
        request.headers && request.headers.cookie && request.headers.cookie.split(';').forEach(function (cookie: any) {
            var parts = cookie.match(/(.*?)=(.*)$/)
            cookies[parts[1].trim()] = (parts[2] || '').trim();
        });
        return cookies;
    };


}
InjectedContainer.addProvider({ provide: SessionManager, useClass: SessionManager });
InjectedContainer.inject(SessionManager);