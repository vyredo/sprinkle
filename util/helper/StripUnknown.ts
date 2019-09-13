import * as Joi from 'joi';
class StripUnknown{
    static target(objTarget: Joi.Schema){
        return {
            value(objValue: Joi.JoiObject){
                let result = {}
                //@ts-ignore
                objTarget._inner.children.forEach(child => {
                    const key = child.key;
                    // @ts-ignore
                    result[key] = objValue[key]
                });
              
                return result;
            }
        };
    }
}

export default StripUnknown