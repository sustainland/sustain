import {DependencyContainer} from './di/dependency-container';
import {getAllModuleMetaData} from './utils';

export class TestEnvironment {
  testModule: any;
  container: DependencyContainer;
  constructor() {}
  buildModule(module: any): any {
    this.container = new DependencyContainer();
    this.testModule = getAllModuleMetaData(module, {scoped: true, container: this.container});
    return this;
  }
  get(provider: any) {
    return this.container.get(provider);
  }
}
