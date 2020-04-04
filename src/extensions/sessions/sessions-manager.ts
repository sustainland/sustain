import { SessionProviders } from "./sessions-providers";
import { Injectable, InjectedContainer } from "../../core/di";
import { uniqueID } from "../../utils/unique-id.util";
import { SExtension } from "../../interfaces/SExtension.interface";
import { SRequest } from "../../interfaces";

InjectedContainer.addProvider({ provide: SessionProviders, useClass: SessionProviders });
InjectedContainer.inject(SessionProviders);
const SessionProvider = InjectedContainer.get(SessionProviders);
@Injectable()
export class SessionManager implements SExtension {

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
    }

    /**
     * TODO : add config option to customize Expires date and domain ....
     * @param request 
     * @param response 
     */
    createIfNotExistsNewSession(request: any, response: any, option?: any) {
        const idSession = this.getIdSessionFromCookies(request);
        if (!idSession) {
            const ids = uniqueID();
            response.setHeader('Set-Cookie', [`${this.SESSION_ID}=${ids}; Path=/ ;`]);
            this.setSession(ids, {})
        } else if (!this.sessions[idSession]) {
            this.sessions[idSession] = {}
        }
    }

    requestApply(request: SRequest) {
        const idSession = this.getIdSessionFromCookies(request);
        request.session = new Proxy({},
            {
                get: (obj, name: any) => {
                    return this.sessions[idSession][name];
                },
                set: (obj, name: string, value, res) => {
                    this.sessions[idSession][name] = value;
                    return true;
                },
            }
        );
    };

    onResponseEndHook() {
        SessionProvider.provider.save(this.sessions);
    }

}
InjectedContainer.addProvider({ provide: SessionManager, useClass: SessionManager });
InjectedContainer.inject(SessionManager);