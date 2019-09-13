import { ShadowMiddleware } from "./appwrapper";

export interface URouter {
    isRouter: boolean;
    get?: (path: string, middle: ShadowMiddleware[]) => void;
    post?: ShadowMiddleware[];
    del?: ShadowMiddleware[];
    patch?: ShadowMiddleware[];
    options?: ShadowMiddleware[];
    put?: ShadowMiddleware[];
    any?: ShadowMiddleware[];
    connect?: ShadowMiddleware[];
    trace?: ShadowMiddleware[];
    ws?: ShadowMiddleware[];
    head?: ShadowMiddleware[];
}

['get' ,'post', 'options', 'del', 'patch', 'put', 'head',  'trace', 'any', 'connect', 'trace', 'ws']