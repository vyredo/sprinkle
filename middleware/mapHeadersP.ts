 import {  HttpResponse } from 'uWebSockets.js'
import { MicroRequest } from '../util/MicroRequest';
import { MicroResponse } from '../util/MicroResponse';
 
 // forEach(cb: (key: string, value: string) => void) : void;
 export async function mapHeadersP(req:MicroRequest, res: MicroResponse): Promise< MicroRequest>  {
     return new Promise(resolve => {
        let headers = {};
        req.forEach((key:string, value: string) => {
            headers[key] = value;
        }) 
        req.headers = headers;
        req.query = req.getQuery();
        resolve(req);
     })
    
 }