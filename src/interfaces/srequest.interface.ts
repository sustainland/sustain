import { IncomingMessage } from "http";

export interface SRequest extends IncomingMessage {
    params: { [key: string]: string | undefined };
    staticFileExist?: boolean;
    startAt?: any;
}