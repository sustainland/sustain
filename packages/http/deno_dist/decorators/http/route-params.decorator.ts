import { Reflect } from "https://deno.land/x/reflect_metadata@v0.1.12/mod.ts";

import { ROUTE_ARGS_METADATA, SWAGGER_ALLOWED_TYPES } from "../../constants.ts";
import { RouteParamtypes } from "../../enums/route-params.enum.ts";
import { ParamData } from "../../interfaces/route-param-metadata.interface.ts";
import { RouteParamMetadata } from "../../interfaces/route-param-metadata.interface.ts";

export function assignMetadata<TParamtype = any, TArgs = any>(
    args: TArgs,
    paramtype: TParamtype,
    index: number,
    data?: ParamData,
    type?: string
) {
    return {
        ...args,
        [`${paramtype}:${index}`]: {
            index,
            data,
            type
        },
    };
}

const createParamDecorator = (paramtype: RouteParamtypes) => {
    return (data?: ParamData): ParameterDecorator => (target: any, key, index) => {

        const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, Object.assign(target)[key]) || {};
        const designtype = Reflect.getMetadata("design:paramtypes", target, key);

        let ParamType = designtype[index].name;
        if (SWAGGER_ALLOWED_TYPES.indexOf(designtype[index].name) !== -1) {
            ParamType = designtype[index].name.toLowerCase();
        }

        Reflect.defineMetadata(
            ROUTE_ARGS_METADATA,
            assignMetadata<RouteParamtypes, Record<number, RouteParamMetadata>>(
                { ...args },
                paramtype,
                index,
                data,
                ParamType
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


