
const jwt = require('jsonwebtoken')


/* -------------------------------------------------------------------------- */
/*        AUTHENTICATION MIDDLEWARE, ADD PAYLOAD TO REQUEST BODY FROM TOKEN        */
/* -------------------------------------------------------------------------- */

const auth = (req,res,next)=>{

    const authHeader = req.headers.authorization
    // console.dir(req,{depth:null})
    if(!authHeader || !authHeader.startsWith('Bearer')){
        throw new Error('!authHeader || !authHeader.startsWith("Bearer")')
    
    }
    const token = authHeader.split(' ')[1]
    try{
        const payload = jwt.verify(token,process.env.JWT_SECRET)
        req.user = {userId:payload.userId,name : payload.name,email:payload.email}
        next()
    }
    catch(e){
        throw new Error(e.message)
    }
}
module.exports = auth