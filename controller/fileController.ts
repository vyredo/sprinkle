import { RequestMap } from "../util/RequestMapper";
import * as Joi from 'joi';

const router = new RequestMap({})
router
    .get('/login')
    .RequestParam('end', Joi.string())
    .Apply((RESULT, req, res ) => {
        console.log(' EXECUTING APPLY')
        console.log(RESULT);
        res.end('hello')
    })

export default router;