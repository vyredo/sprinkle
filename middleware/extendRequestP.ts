import {HttpRequest, HttpResponse } from 'uWebSockets.js'
import parse from 'fast-json-parse';
import { MicroRequest } from '../util/MicroRequest';

export function jsonParserP(res:HttpResponse, req: MicroRequest, next): void{
        let buffer;
        res.onData((ab, isLast) => {
            let chunk = Buffer.from(ab);
            if (isLast) {
              let json;
              if (buffer) {
                try {
                  json = parse(Buffer.concat([buffer, chunk]));
                } catch (e) {
                  /* res.close calls onAborted */
                  res.close();
                  return;
                }
                next(true);
              } else {
                try {
                    const str = chunk.toString();
                    json = JSON.parse(str);
                } catch (e) {
                  /* res.close calls onAborted */
                  res.close();
                  return;
                }
                req.body = json;
                next(true);
              }
            } else {
              if (buffer) {
                buffer = Buffer.concat([buffer, chunk]);
              } else {
                buffer = Buffer.concat([chunk]);
              }
            }
          });
        
          /* Register error cb */
          res.onAborted(next);
    }

