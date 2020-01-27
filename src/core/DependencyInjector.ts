declare type Dependency = any;

/**
 * Dependency injection container
 *
 * Example:
 *
 *     // There is a class
 *     class Auth { ... }
 *
 *     let di = new Di();      // Makes a container
 *     di.set(Auth);           // Add the dependency
 *     global['appDi'] = di;   // Publish container
 *
 *     // Get instance from Di in another place
 *     let auth: Auth = appDi.get(Auth);
 *     // or
 *     let auth: Auth = appDi.get('Auth');
 *
 */
class DependencyInjector {
  private _container = new Map<any, Dependency>();

  /**
   * Add a dependency to the container
   *
   * Example 1:
   *
   *     di.set('someName', 'example string value');
   *     di.set('App', App);
   *     di.set('config', {apiUrl : 'http://...'});
   *
   * Example 2:
   *
   *     // The class will be used also as key
   *     di.set(App, App);
   *     di.set(ModuleManager);
   *
   */
  public set(key: any, value?: Dependency): void {
    if (key instanceof Function) {
      value = key;
      key = this.getClassName(key);
    }

    if (value instanceof Function) {
      this._container.set(key, new value());
    } else if (value) {
      this._container.set(key, value);
    } else {
      throw new Error(`Di: Dependency entity should be a true value. Actual: ${typeof value}`);
    }
  } // end set();

  public get(key: any): Dependency {
    if (key instanceof Function) {
      key = this.getClassName(key);
    }

    return this._container.get(key);
  }

  /**
   * @param key
   * @return {boolean} is deleted successful
   */
  public remove(key: any): boolean {
    return this._container.delete(key);
  }

  public has(key: any): boolean {
    return this._container.has(key);
  }

  private getClassName(Class: any): string {
    return Class.name;
  }
}

export default new DependencyInjector()