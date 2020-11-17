
export type ParamData = object | string | number;

export interface RouteParamMetadata {
    index: number;
    data?: ParamData;
}