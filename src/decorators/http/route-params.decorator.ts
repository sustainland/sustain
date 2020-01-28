import { isNil } from "../../utils/shared.utils";
import { isString } from "util";
import { ROUTE_ARGS_METADATA } from "../../constants";

export enum RouteParamtypes {
    REQUEST,
    RESPONSE,
    NEXT,
    BODY,
    QUERY,
    PARAM,
    HEADERS,
    SESSION,
    FILE,
    FILES,
    HOST,
    IP,
}

export type ParamData = object | string | number;
export interface RouteParamMetadata {
    index: number;
    data?: ParamData;
}

export function assignMetadata<TParamtype = any, TArgs = any>(
    args: TArgs,
    paramtype: TParamtype,
    index: number,
    data?: ParamData
) {
    return {
        ...args,
        [`${paramtype}:${index}`]: {
            index,
            data,
        },
    };
}

const createParamDecorator = (paramtype: RouteParamtypes) => {
    return (data?: ParamData): ParameterDecorator => (target, key, index) => {
        const args =
            Reflect.getMetadata(ROUTE_ARGS_METADATA, Object.assign(target)[key]) || {};
        Reflect.defineMetadata(
            ROUTE_ARGS_METADATA,
            assignMetadata<RouteParamtypes, Record<number, RouteParamMetadata>>(
                args,
                paramtype,
                index,
                data,
            ),
            Object.assign(target)[key]
        );

        let result = Reflect.getMetadataKeys(Object.assign(target)[key]);

    };
};

export const Request: () => ParameterDecorator = createParamDecorator(
    RouteParamtypes.REQUEST,
);

export const Response: () => ParameterDecorator = createParamDecorator(
    RouteParamtypes.RESPONSE,
);

export const Next: () => ParameterDecorator = createParamDecorator(
    RouteParamtypes.NEXT,
);

export const Session: () => ParameterDecorator = createParamDecorator(
    RouteParamtypes.SESSION,
);


