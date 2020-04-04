import { SRequest } from "./srequest.interface";

export interface SExtension {
    requestApply: (request: SRequest, responce?: any) => void;
    hookOnExitApp?: () => void;
    onResponseEndHook?: () => void;
}