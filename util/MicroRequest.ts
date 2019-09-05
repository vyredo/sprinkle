import { HttpRequest, RecognizedString, HttpResponse } from "uWebSockets.js";
import { Buffer } from "buffer";

export interface MicroRequest extends HttpRequest {
    url: string;
    body: null | Object;
    headers: null | Object;
    query: string;
}


export function extendRequestP(req: HttpRequest, res: HttpResponse): Promise<MicroRequest>{
    
    // parse json from middleware not from here;
    // can parse gRPC from middleware also;
    return new Promise(resolve => {
        // @ts-ignore
        req.url = req.getUrl();
        readJson(res, req, (err) => {
            console.error(err)
        })
        .then(newReq => {
            resolve(newReq as MicroRequest)
        })
        .catch(console.error)    
    })
}

/* Helper function for reading a posted JSON body */
function readJson(res, req, err) {
    return new Promise((resolve) => {
        let buffer;
        /* Register data cb */
        res.onData((ab, isLast) => {
            let chunk = Buffer.from(ab);
            if (isLast) {
                let json;
                if (buffer) {
                    try {
                        // @ts-ignore
                        json = JSON.parse(Buffer.concat([buffer, chunk]));                        
                    } catch (e) {
                        /* res.close calls onAborted */
                        res.close();
                        return;
                    }
                    req.body = json;
                    resolve(req)
                    return;
                }
                try {
                    if(chunk.length > 0){
                        // @ts-ignore
                        json = JSON.parse(chunk);
                    }
                } catch (e) {
                    console.error(e)
                    /* res.close calls onAborted */
                    res.close();
                    return;
                }
                req.body = json;
                resolve(req)
            } else {
                if (buffer) {
                    buffer = Buffer.concat([buffer, chunk]);
                } else {
                    buffer = Buffer.concat([chunk]);
                }
            }
        });
    
        /* Register error cb */
        res.onAborted(err);
    })
  }