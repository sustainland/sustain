import { ROUTE_ARGS_METADATA } from "../../constants";
import { RouteParamtypes } from "../../enums/route-params.enum";
import { ParamData } from "../../interfaces/route-param-metadata.interface";
import { RouteParamMetadata } from "../../interfaces/route-param-metadata.interface";



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
    };
};

export const Request: () => ParameterDecorator = createParamDecorator(
    RouteParamtypes.REQUEST,
);

export const Headers: () => ParameterDecorator = createParamDecorator(
    RouteParamtypes.HEADERS,
);

export const Header: (name: string) => ParameterDecorator = createParamDecorator(
    RouteParamtypes.HEADER,
);

export const Query: (name?: string) => ParameterDecorator = createParamDecorator(
    RouteParamtypes.QUERY,
);

export const Body: (name?: string) => ParameterDecorator = createParamDecorator(
    RouteParamtypes.BODY,
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


export const Param: (name: string) => ParameterDecorator = createParamDecorator(
    RouteParamtypes.PARAM,
);
export const Params: () => ParameterDecorator = createParamDecorator(
    RouteParamtypes.PARAMS,
);


