const jwt = require('jsonwebtoken');
require('dotenv').config();
const generateToken=(user)=>{
    return jwt.sign({
          payload:{
            id:user._id
        }
    },
    process.env.SECRET_KEY,{
        expiresIn:"30d",
    });
}
module.exports=generateToken;