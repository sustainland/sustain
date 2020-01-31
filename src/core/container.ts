import { Container } from "./di";

class DependencyInjectionContainer {
    container = new Container();

    containerMap = new Map<any, any>();
    constructor() {
    }
    addProvider(provideParams: any) {
        this.container.addProvider(provideParams);
    }
    inject(InjectableClass: any) {
        if (!this.containerMap.get(InjectableClass)) {
            const instance = this.container.inject(InjectableClass)
            return this.containerMap.set(InjectableClass, instance);
        }
    }

    get(injectedClass: any) {
        return this.containerMap.get(injectedClass);
    }
}

export const InjectedContainer = new DependencyInjectionContainer() ;
