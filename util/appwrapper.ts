import * as fs from 'fs';
import { resolve } from 'path';
import * as util from 'util';
import { TemplatedApp, HttpRequest, HttpResponse, RecognizedString, us_listen_socket } from "uWebSockets.js";
import { extendResponse, MicroResponse } from "./MicroResponse";
import { mapHeadersP } from '../middleware/mapHeadersP'
import { extendRequestP, MicroRequest } from "./MicroRequest";
import { URouter } from './uRouter';
import { RequestMap } from "./RequestMapper";
import { pipeStreamOverResponse, toArrayBuffer, streamToString, streamToBuffer } from './helper/pipestream';
const fileType = require('file-type');

// import { getMime, sendFile } from './helpers/sifrr-server';
const readFile = util.promisify(fs.readFile);

type Callback = (res: HttpResponse, req: HttpRequest) => void;
export type ShadowMiddleware = (req: MicroRequest, res: MicroResponse) => Promise<MicroRequest>;

interface Wrap {
    use: (fnOrStr: string | ShadowMiddleware, router?: RequestMap ) => Wrap;
    listen(host: number | RecognizedString, cb: (listenSocket: us_listen_socket | any) => void):void;
    static(path:string, options: IStaticOption): Wrap;
}
type TemplatedAppMethods = 'get' | 'post' | 'options' | 'del' | 'patch' | 'put' | 'head' | 'trace' | 'any' | 'connect' | 'trace' | 'ws'
interface IStaticOption {
    maxCache?: number;
}
interface IStaticCache {
    [key: string]: {
        file: Buffer;
        size: number;
    }
}
export function uApp (app:TemplatedApp) : Wrap {
    let memoMiddleware:ShadowMiddleware[] = [
        mapHeadersP, extendRequestP
    ];
    let staticFile = {
        staticFilePaths: [],
        staticOptions: null,
        dirs: []
    }
    const methods: TemplatedAppMethods[] = ['get' ,'post', 'options', 'del', 'patch', 'put', 'head',  'trace', 'any', 'connect', 'trace', 'ws' ]
    const wrapInterface = {
        use(fnOrPath:ShadowMiddleware | string, router?: RequestMap) {
            if(typeof fnOrPath === 'function'){
                memoMiddleware.push(fnOrPath as ShadowMiddleware);
            }
            if(typeof fnOrPath === 'string' && (router as RequestMap).isRequestMap ){
                const route = router._route;
                Object.keys(route).forEach(httpMethod => {
                    Object.keys(route[httpMethod]).forEach(pathname => {
                        const path = (fnOrPath.slice(-1)[0] === '/') ? fnOrPath.slice(0, -1) : fnOrPath;
                        const absolutePath = String(path + pathname);
                        const func = route[httpMethod][pathname];
                        const callback = (fn) => async (res: HttpResponse, req: HttpRequest) => {
                            try {
                                res.onAborted(() => {
                                    res.aborted = true;
                                });                                
                                console.log('asdf')
                                const uResponse = extendResponse(res);
                                const uRequest = await runOneMiddleware(req, res, memoMiddleware);
                                console.log('await done', uRequest)
                                
                                fn(uRequest, uResponse);
                            } catch(e) {
                                console.log(e)
                                throw new Error(e.toString());
                            }
                        };
                        
                        app[httpMethod](absolutePath.trim(), callback(func))
                    })
                })
            }
            return this;
        },
        static(path:string, option?: IStaticOption){
            staticFile.dirs = fs.readdirSync(path);
            staticFile.staticFilePaths = staticFile.dirs.map(filename => path + '/' + filename)
            staticFile.staticOptions = option; 
            return this;
        },

        async listen(host: number | RecognizedString, cb: (listenSocket: us_listen_socket | any) => void){
            const staticFileCache:IStaticCache = await cacheStaticFile(staticFile)
            Object.keys(staticFileCache).forEach(path => {
                const cache = staticFileCache[path];
                app.get(path, (res, req) => {
                    res.writeHeader('Content-Type', fileType(cache.file).mime)
                    res.end(cache.file)
                })
            });

            app.get('/ping', (res, req) => {
                res.end('pong')
            })

            // for method like listen, it will executed directly without middleware
            if(typeof host === 'number'){
                return app.listen(host as number, cb as any);
            } 


            // @ts-ignore host is now RecognizedString
            return app.listen(host, cb)


        },
       
    } as Wrap;
    return wrapInterface;
}

function cacheStaticFile(staticFile): Promise<IStaticCache>{
    
    const { dirs, staticFilePaths, staticOptions } = staticFile;
    const maxCache = staticOptions ? staticOptions.maxCache : undefined;
    let _staticFileCache = {};
    return new Promise((resolve, reject) => {
        if(!maxCache || maxCache <= 0){
            return resolve();
        }
        Promise.all(staticFilePaths.map( async (pathFileName:string, idx: number) => {
            const readStream: fs.ReadStream = fs.createReadStream(pathFileName);
            // const size = fs.statSync(pathFileName)
            // const totalSize = fs.statSync(pathFileName).size;
            const file:Buffer = await streamToBuffer(readStream);
            const staticPath = '/'+dirs[idx]
            _staticFileCache[staticPath] = {file, size: file.length};
        })).then(res => {
            resolve(_staticFileCache);
        }).catch(err => {
            reject(err)
            console.error(err)
        })
    })
}

function allowUndefinedOrNull(a:any){
    // by default middleware that return nothing, will be allowed to execute next middleware.
    if (typeof a === 'undefined' ||  a === true) return true
    else if (a === false) return false;
}

async function runOneMiddleware(req, res, middlewares){
    const middleware = middlewares[0];
    middlewares = middlewares.slice(1)
    const newRequest = await middleware(req, res);

    if(middlewares.length <= 0){
        return newRequest;
    }
    return runOneMiddleware(newRequest, res, middlewares);
}