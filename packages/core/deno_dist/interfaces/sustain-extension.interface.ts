import {SustainResponse} from './SustainResponce.interface.ts';
import {SustainRequest} from './srequest.interface.ts';

export interface SustainExtension {
  requestApply?: (request: SustainRequest, responce?: SustainResponse) => void;
  hookOnExitApp?: () => void;
  onResponseEndHook?: (request?: SustainRequest, responce?: SustainResponse) => void;
  onResponseStartHook?: (request?: SustainRequest, responce?: SustainResponse) => void;
  onResquestStartHook?: (request?: SustainRequest, responce?: SustainResponse) => void;
}
