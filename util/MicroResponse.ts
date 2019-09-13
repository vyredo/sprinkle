import { HttpResponse, RecognizedString } from "uWebSockets.js";

export interface MicroResponse extends HttpResponse {
    isuWS: boolean;
    json(obj:Object):void;
    statusCode? : number;
}


export function extendResponse(res: HttpResponse){
    let microResponse: any = {};
    
    microResponse.isUWS = true;
    microResponse.status = (n:RecognizedString) => {
        return res.writeStatus(String(n))
    };
    microResponse.json = (obj)=>{
        const _json = JSON.stringify(obj)
        res.writeHeader('Content-Type', 'application/json');
        res.end(_json)
    }
    // microResponse.end = (r?:RecognizedString) => {
    //     if (!res.aborted) {
    //         res.end(r);
    //     }
    //     return res;
    // }
    for(let key in microResponse){
        res[key] = microResponse[key]
    }
    return res as MicroResponse;
}