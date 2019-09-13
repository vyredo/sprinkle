import { RequestMap } from "../util/RequestMapper";
import * as Joi from 'joi';

const router = new RequestMap()

router
    .post('/login')
    .QueryString('end', Joi.string())
    .RequestBody({
        schema: Joi.object().keys({
            username: Joi.string().alphanum().min(3).max(30).required(),
            password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
            access_token: [Joi.string(), Joi.number()],
            birthyear: Joi.number().integer().min(1900).max(2013),
            email: Joi.string().email()  
        }),
        valid: true
    })
    .Apply((RESULT, req, res ) => {
        res.end('hello')
    })

router
    .get("/hello")
    .QueryString('test', Joi.string().required())
    .Apply((RESULtT, req, res) => {
         res.json({'hello': 'vidy'})
    })

router
    .get('/login')
    .QueryString('end', Joi.string().required())
    .RequestBody({
        schema: Joi.object().keys({
            username: Joi.string().alphanum().min(3).max(30).required(),
            password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
            access_token: [Joi.string(), Joi.number()],
            birthyear: Joi.number().integer().min(1900).max(2013),
            email: Joi.string().email()  
        }),
        valid: true
    })
    .Apply((RESULT, req, res ) => {
        res.end('hello')
    })

export default router;