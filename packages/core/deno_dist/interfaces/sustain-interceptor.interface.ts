export interface SustainInterceptor {
  name?: string;
  intercept(...args: any[]): void | Promise<any>;
}
