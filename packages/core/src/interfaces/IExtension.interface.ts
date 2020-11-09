import {SRequest} from './srequest.interface';

export interface IExtension {
  requestApply?: (request: SRequest, responce?: any) => void;
  hookOnExitApp?: () => void;
  onResponseEndHook?: (request?: SRequest, responce?: any) => void;
  onResponseStartHook?: (request?: SRequest, responce?: any) => void;
  onResquestStartHook?: (request?: SRequest, responce?: any) => void;
}
