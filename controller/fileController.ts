import { RequestMap } from "../util/RequestMapper";
import * as Joi from 'joi';

const router = new RequestMap({})
router
    .get('/login')
    .RequestParam('end', Joi.string())
    .Apply((RESULT, req, res ) => {
        res.end('hello')
    })

export default router;