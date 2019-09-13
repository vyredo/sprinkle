import { HttpRequest, HttpResponse, TemplatedApp } from "uWebSockets.js";
import constructObjectFromRefUrl from './helper/constructObjectFromRefUrl';
import StripUnknown from './helper/StripUnknown'
import createDocumentation, { SprinkleDocDescription } from './helper/createDocumentation'
//@ts-ignore
import { error } from "util";

import * as Joi from 'joi'
import { MicroResponse } from "./MicroResponse";
import { MicroRequest } from "./MicroRequest";
import { URouter } from "./uRouter";

interface IRESULT {
    query: unknown;
    parameters: unknown;
    body: unknown;
    criteria: unknown;
}

// class ValidatorOption {
//     '@sprinkle'?:SprinkleDocDescription;
//     required: boolean;
//     type: Function;
//     as?: string
// }
export interface IRoute {
    get: any;
    [key: string]: any;
}
export class RequestMap {
    isRequestMap = true;
    _route: URouter;
    _routeDocs:any[] = [];
    constructor(route?: URouter){ 
    this._route = {...route, isRouter:true};
        this._routeDocs = [];
    }
    get(pathname:string):RequestValidator{
        const req = new RequestValidator(this._route, 'get', pathname);
        return req
    }
    post(pathname:string):RequestValidator{
        return new RequestValidator(this._route, 'post', pathname);
    }
    put(pathname:string):RequestValidator{
        return new RequestValidator(this._route, 'put', pathname);
    }
    delete(pathname:string):RequestValidator{
        return new RequestValidator(this._route, 'delete', pathname);
    }
}

declare class RequestBodyOption{
    valid:boolean;
    schema:Joi.ObjectSchema;
    '@sprinkle'?:SprinkleDocDescription;
}
declare class AuthorizeOption{
    type?: string;
    validator: (token:string)=>boolean;
    responseMessage?: string;
    responseStatus?: string|number;
    '@sprinkle'?:SprinkleDocDescription;
}
declare class ExecutionResult {
    errorMessages:Array<String>; 
    isValid:boolean;
    result:{}
}

export class RequestValidator {
    constructor(_route: URouter, _HttpMethod:string, pathname:string){
        this._route = _route;
        this._HttpMethod = _HttpMethod;
        this._HttpPathName = pathname;
    }
    private _route: URouter;
    private _HttpMethod:string;
    private _HttpPathName:string;
    private _authorizeOption:AuthorizeOption | null = null;
    //@ts-ignore
    private _queryString:Object = {};
    private _requestBody?: {
        schema: Joi.ObjectSchema, // ConstraintObject
    };
    private _requestCriteria?: {
        schema: Joi.ObjectSchema, // ConstraintObject
    }
    private _responseBody?:any = {}; // {valid:boolean, 200: schemaObject}
    private _prefixError = () => `Error on ${this._HttpMethod.toUpperCase()}, ${this._HttpPathName}. Reason: `;
    private _executeAuthorize(req: MicroRequest):boolean{
        if(!this._authorizeOption) return true;

        let {validator, type} = this._authorizeOption;
            type = type ? type.trim() : 'Basic'
        const authorizeToken = req.headers ? req.headers.authorization : null;
        if(!authorizeToken) return false;
        const tokenType = type[0].toUpperCase() + type.slice(1) + ' ';
        
        if(!authorizeToken.startsWith(tokenType)) return false;
        
        return validator(authorizeToken.split(tokenType)[1]);
    }
    private _executeQueryString(req:MicroRequest):ExecutionResult {

        let errorMessages: string[] = [];
        let result: Object = {};
        const queryString:string = req.query;
        let objToValidate:any = {}
        if(Object.keys(this._queryString).length <= 0) return {errorMessages, isValid: true, result};
        if(!queryString)  return {errorMessages: ['No Query String'], isValid:false, result} 
        let schema:Joi.Schema = Joi.object().keys(this._queryString as Joi.SchemaMap).unknown();
        queryString.split('&').forEach(keyValue => {
            const [key, value] = keyValue.split('=');
            objToValidate[key] = value;
        });

        const objError = Joi.validate(objToValidate, schema, {abortEarly: false});
        console.log(objError)
        if(!objError.error){
            return {errorMessages, isValid: true,
                result: objToValidate
            }
        }
        
        errorMessages = objError.error.details.map(err => {
            const message = err.message.split(" ").slice(1).join(" ");
            const path = err.path;
            return path + " " + message;
        })
        return { errorMessages, isValid: false, result }
    }
    private _executePathVariable(req:MicroRequest):ExecutionResult{
        let errorMessages: string[] = [];
        let result: Object = {};
        if(Object.keys(this._queryString).length <= 0) return {errorMessages, isValid: true, result};

        let objToValidate = {}
        const path = req.url.split('/').slice(1);
        const objMap = constructObjectFromRefUrl(this._HttpPathName);
        const isQueryStringValidating = Object.keys(objMap).length > 0;
        if(!isQueryStringValidating){
            return {isValid:true, errorMessages:[], result:{}}
        }
        Object.keys(this._queryString).forEach(pathname => {
            const position = objMap[pathname];
            let value = path[position];
                value = value.indexOf('?') ? value.split('?')[0] : value;
            objToValidate[pathname] = value;
        })

        let schema:Joi.Schema = Joi.object().keys(this._queryString as Joi.SchemaMap).unknown();

        const objError = Joi.validate(objToValidate, schema, {abortEarly: false});
        if(!objError.error){
            return {errorMessages, isValid: true,
                result: objToValidate
            }
        }
        
        errorMessages = objError.error.details.map(err => {
            const message = err.message.split(" ").slice(1).join(" ");
            const path = err.path;
            return path + " " + message;
        })
        return { errorMessages, isValid: false, result }
    }

    private _executeRequestBody(req:MicroRequest):ExecutionResult{
        if(!this._requestBody) return {errorMessages: [], isValid: true, result:{}};
        let result;
        const objToValidate = req.body;

        const schema = this._requestBody.schema;
        if(schema) result = Joi.validate(objToValidate, schema, { abortEarly: false });

        let errorMessages:string[] = [];
        (result.error) && result.error.details.forEach((err:any) => {
            const message = err.message.split(" ").slice(1).join(" ");
            const pathname = err.path[0];
            errorMessages.push(pathname+ " " + message)
        });
        let stripUnknownKeys = StripUnknown.target(schema).value(result.value)
        const isValid = errorMessages.length === 0;
        return { errorMessages, isValid, result : stripUnknownKeys}
    }
    private _executeResponseBody(obj:any, statusCode:string|number){

        const schema = this._responseBody[statusCode]
        if(!schema) return { isValid: false, objError: {SchemaNotFound: 'No Schema provided for response status ' + statusCode }}
        const objError = Joi.validate(obj, schema, {abortEarly: false, stripUnknown: true });
        const isValid = objError.error ? false : true;

        return { isValid, objError };
    }
    private _returnResponse(res, status, message){
        return res.status(status).json({message})
    }

    private _executeRequestCriteria(req:MicroRequest){
        let errorMessages: string[] = [];
        let queryString:string = req.url.split('?')[1];
        let objToValidate = {}
        if(!this._requestCriteria) return { errorMessages, isValid:true, result:{} }
        if(!queryString)  return {errorMessages: ['No Query String'], isValid:false, result:{}} 
        let schema:Joi.Schema = this._requestCriteria.schema;

        queryString.split('&').forEach(keyValue => {
            const [key, value] = keyValue.split('=');
            objToValidate[key] = value;
        });
       
        let result: Joi.ValidationResult<any> = Joi.validate(objToValidate, schema, {abortEarly: false });
        (result.error) && result.error.details.forEach((err:any) => {
            const message = err.message.split(" ").slice(1).join(" ");
            const pathname = err.path[0];
            errorMessages.push(pathname+ " " + message)
        });
        let stripUnknownKeys = StripUnknown.target(schema).value(result.value)
        const isValid = errorMessages.length === 0;
        return { errorMessages, isValid, result : stripUnknownKeys}
    }

    RequestCriteria(schema:Joi.ObjectSchema): RequestValidator{
        const self = this;

        (function validateRequestBody(){
            if(!schema) throw new Error(self._prefixError() + 'No schema is provided.')
        })()
        schema.unknown();
        
        this._requestCriteria = {
            schema
        };
        return this;
    }

    AuthorizeHeader(option: AuthorizeOption):RequestValidator{        
        const self = this;
        (function validateAuthorize(){
            if(!option) throw new Error(self._prefixError() + ` No validator to authorize the token`);
        })()
       
        const responseMessage = option.responseMessage ? option.responseMessage : 'Not Authorized';
        const responseStatus = option.responseStatus ? option.responseMessage : 401;
        const type = option.type ? option.type : 'jwt';
        const validator = option.validator;
        //token can be accessed in .APPLY
        this._authorizeOption = { type, responseMessage, responseStatus, validator };
        return this;
    }

    RequestBody(option?:RequestBodyOption):RequestValidator{
        const self = this;
        
        (function validateRequestBody(){
            if(!option) throw new Error(self._prefixError() + 'No arguments is provided.')
            if(option.valid && !option.schema) throw new Error(self._prefixError() + 'No schema to Validate request body');
        })()
        this._requestBody = {
            schema: option.schema
        };
        return this;
    }
    RequestHeader(){
        return;
    }
    QueryString(queryvar:string | Joi.Schema, joiValidation?: Joi.Schema):RequestValidator{
        if(typeof queryvar === 'object' && (queryvar as Joi.Schema).isJoi){
            this._queryString['any'] = (queryvar as Joi.Schema);
            return this;
        }

        this._queryString[queryvar as string] = joiValidation;
        return this;
    }
    // QueryString(pathvar:string, joiValidation?:Joi.Schema):RequestValidator {
    //     this._queryString[pathvar] = joiValidation;
    //     return this;
    // }
    ResponseBody(obj){
        if("valid" in obj && obj.valid && !obj[200]) throw new Error(this._prefixError() + 'Response need to be validated but no schema')
        if(obj) this._responseBody = obj;
        return this;
    }
    
    Apply(callback:(RESULT:IRESULT, req:MicroRequest, res: MicroResponse)=>void):void {
        const self = this;
        const {_route, _HttpMethod, _HttpPathName } = this;
        if(!_route.hasOwnProperty(_HttpMethod)){
            _route[_HttpMethod] = {};
        }
        //@ts-ignore
        _route[_HttpMethod][_HttpPathName] = (function(parent){ 
            return function (req:MicroRequest, res:MicroResponse){
                let RESULT = {};
                let errorMessages:String[] = [];
                const BAD_PATH_VARIABLE_STATUS = 400;

                if(!parent._executeAuthorize(req) && parent._authorizeOption){
                    // if not authorized return 401
                    return parent._returnResponse(res, 
                        parent._authorizeOption.responseStatus, 
                        parent._authorizeOption.responseMessage);
                } 

                const requestParamResult = parent._executePathVariable(req);
                if(!requestParamResult.isValid) errorMessages = errorMessages.concat(requestParamResult.errorMessages);

                const queryStringResult = parent._executeQueryString(req);
                if(!queryStringResult.isValid) errorMessages = errorMessages.concat(queryStringResult.errorMessages); 

                const requestBodyResult = parent._executeRequestBody(req);
                if(!requestBodyResult.isValid) errorMessages = errorMessages.concat(requestBodyResult.errorMessages);

                // @ts-ignore
                const requestCriteriaResult = parent._executeRequestCriteria(req);
                if(!requestCriteriaResult.isValid) errorMessages = errorMessages.concat(requestBodyResult.errorMessages);

                if(errorMessages.length > 0 ){
                    return parent._returnResponse(res, BAD_PATH_VARIABLE_STATUS, errorMessages);
                }
                
                RESULT = {  ...RESULT, 
                    query: queryStringResult.result, 
                    parameters: requestParamResult.result, 
                    body: requestBodyResult.result, 
                    criteria: requestCriteriaResult.result
                } as IRESULT;  

                //@ts-ignore          
                res.json = function (obj) {
                    //@ts-ignore
                    if(self._responseBody.valid){
                        const statusCode = res.statusCode || 200;
                        const { isValid, objError } = self._executeResponseBody(obj, statusCode);
                        if(isValid) {
                            return res.json(obj);
                        }

                        return res.status(500).json({data: objError, 
                            message: 'Failed Validation of Response DTO'
                        });
                    
                    }
                    //no need to validate
                    try {
                        const objString = JSON.stringify(obj);
                        return res.end(objString)
                    } catch(e){
                        console.error(e)
                        res.writeStatus("500").end();
                    }
                };
                
                callback(RESULT as IRESULT, req, res);
            }
        }(self));
    }
}