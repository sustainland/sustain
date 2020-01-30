import SessionProviders from "./sessions-providers";
import { SessionsProviders } from "../constants";

let sessions: any = {};
const SessionManager = new SessionProviders(SessionsProviders.File);

export function getSession(idSession: string) {
    sessions = SessionManager.provider.load();

    if (sessions[idSession]) {
        return Object.assign({}, sessions[idSession]);
    } else {
        return null
    }
}

export function setSession(idSession: string, data: any) {
    sessions[idSession] = data;
    console.log(sessions)
    SessionManager.provider.save(sessions);
}

export function getCookies(request: any) {
    var cookies: any = {};
    request.headers && request.headers.cookie && request.headers.cookie.split(';').forEach(function (cookie: any) {
        var parts = cookie.match(/(.*?)=(.*)$/)
        cookies[parts[1].trim()] = (parts[2] || '').trim();
    });
    return cookies;
};