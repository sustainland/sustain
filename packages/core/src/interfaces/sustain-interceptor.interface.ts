export interface SustainInterceptor {
    intercept(...args: any[]): void | Promise<any>;
}
