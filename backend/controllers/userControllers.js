const expressAsyncHandler = require("express-async-handler");
const User=require('../Models/userModel');
const bcrypt=require('bcrypt');
const generateToken=require('../config/genToken');
const registerUser=expressAsyncHandler(async(req,res)=>{
       const {name,email,password,pic}=req.body;
       if(!name || !email || !password){
        res.status(400);
        throw new Error("Please enter all fileds");
       }
       const pastUser=await User.findOne({email});
       if(pastUser){
        res.status(400);
        throw new Error("Already a user");
       }
       const hashed=await bcrypt.hash(password,10);
       const user=await User.create({
        name,email,password:hashed,pic
       })
       if(user){
        res.status(201).json({
            message: "success",
            _id:user._id,
            name:name,
            email:email,
            pic:pic,
            token:generateToken(user)
        })
       }
       else{
        res.status(400);
        throw new Error("User not found");
       }
})
const loginUser=expressAsyncHandler(async(req,res)=>{
          const {email,password}=req.body;
          if(!email || !password){
              res.status(400);
              throw new Error("Please enter the details");
          }
          const user=await User.findOne({email});
          
          if(user && await bcrypt.compare(password,user.password)){
              res.json({
                message: "start chating",
                _id:user._id,
                name:user.name,
                email:user.email,
                pic:user.pic,
                token:generateToken(user._id)
              })
          }
          else{
            res.status(400);
            throw new Error("register please");
          }
}
)
const allUsers=expressAsyncHandler(async (req,res)=>{
          const key=req.query.search? {
               $or:[
                {name:{$regex:req.query.search ,$options:"i"}},
                {
                  email:{$regex:req.query.search ,$options:"i"}
                }
               ]
          }:{};
          const users=await User.find(key).find({_id:{$ne:req.user.id}});
          res.send(users);
})
module.exports={registerUser,loginUser,allUsers};