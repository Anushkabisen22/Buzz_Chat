const asyncHandler =require('express-async-handler');
const jwt=require('jsonwebtoken');
require('dotenv').config();
const validate=asyncHandler(async (req,res,next)=>{
    let token;
    let authHeader=req.headers.Authorization || req.headers.authorization;
    if(authHeader && authHeader.startsWith("Bearer")){
        token=authHeader.split(" ")[1];
        jwt.verify(token,process.env.SECRET_KEY,(err,decoded)=>{
            if(err){
                res.status(400);
                throw new Error("not a valid user")
            }
            console.log(decoded);
            req.user=decoded.payload;
            next();
        })
    }
    if(!token){
        res.status(400);
        throw new Error("unauthorised user");
    }
});
module.exports=validate;