import {BehaviorSubject} from 'rxjs';
import {filter} from 'rxjs/operators';

export class SustainContext {
  subject = new BehaviorSubject({});
  constructor() {}
  context: any = {};
  set(key: string, value: any) {
    this.context[key] = value;
    this.subject.next({
      action: key,
      value,
    });
  }
  sub() {
    return this.subject;
  }
  get(key: string) {
    return this.context[key];
  }
  on(key: string) {
    return this.subject.pipe(filter((payload: any) => payload.action === key));
  }
}
const injectedContext = new SustainContext();

export function getContext() {
  return injectedContext;
}
