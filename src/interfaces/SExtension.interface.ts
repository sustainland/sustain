import { SRequest } from "./srequest.interface";

export interface SExtension {
    apply: (request: SRequest) => void;
}