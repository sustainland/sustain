// @deno-types="https://raw.githubusercontent.com/Soremwar/deno_types/07a52c868823928b792e870a572b24af36a4b665/rxjs/v6.5.5/rxjs.d.ts"
import {BehaviorSubject} from "https://cdn.skypack.dev/rxjs@6.6.3";;
// @deno-types="https://raw.githubusercontent.com/Soremwar/deno_types/07a52c868823928b792e870a572b24af36a4b665/rxjs/v6.5.5/operators.d.ts"
import __rxjs_operators_ns from "https://dev.jspm.io/rxjs@6.6.3/operators";
const {filter} = __rxjs_operators_ns;;

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
