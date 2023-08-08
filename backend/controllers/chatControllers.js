const expressAsyncHandler = require("express-async-handler");
const User=require('../Models/userModel');
const Chats = require('../Models/chatModel');
const Messages = require('../Models/messageModel');
const accessChats=expressAsyncHandler(async (req,res)=>{
    // const Id=req.user.id;
    const {Id}=req.body;
    if(!Id){
        console.log("not a valid user");
        res.status(400);
    }
    var isChat=await Chats.find({
        isGroup:false,
        $and:[
             {users:{$elemMatch:{$eq:req.user.id}}},
             {users:{$elemMatch:{$eq:Id}}}
        ]
    }).populate("users","-password").populate("lastMsg");

    isChat=await User.populate(isChat,{
        path:"lastMsg.sender",
        select:"name pic email"

    });
    if(isChat.length>0){
        res.send(isChat[0]);
    }else{
        const newChat={
            chatName:"sender",
            isGroup:false,
            users:[req.user.id,Id]
        }
        try {
           const createNewChat=await Chats.create(newChat);
           const sendChat=await Chats.findOne({_id:createNewChat._id}).populate("users","-password");
           res.status(200).send(sendChat);
        } catch (error) {
                 res.status(400);
                 throw new Error(error.message);
        }
    }
    
})
const fetchChats=expressAsyncHandler(async (req,res)=>{
    try {
        console.log(req.user);
    Chats.find({ users: { $elemMatch: { $eq: req.user.id } } })
      .populate("users", "-password")
      .populate("gpAdmin", "-password")
      .populate("lastMsg")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "lastMsg.sender",
          select: "name pic email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
})
const createGroup=expressAsyncHandler(async (req,res)=>{
    if(!req.body.users || !req.body.name){
        res.status(400).json({message:"Please fill all the fields"});
    }
    var users=JSON.parse(req.body.users);
    if(users.length <2){
        res.status(400);
        res.send("more than two users required");
    }
    users.push(req.user.id);
    try {
        const gpChat=await Chats.create({
            chatName:req.body.name,
            users:users,
            isGroup:true,
            gpAdmin:req.user.id
        })
        const fullChat=await Chats.findOne({_id:gpChat._id}).populate("users","-password").populate("gpAdmin","-password");
        res.status(200).json(fullChat);
    } catch (error) {
        console.log(error);
    }
                //  res.json({
                //     message:"create groups"
                //  })
})
const updateName=expressAsyncHandler(async (req,res)=>{
    const {chatId,chatName}=req.body;
    const updateChat=await Chats.findByIdAndUpdate(chatId,{chatName:chatName},{new:true}).populate("users","-password").populate("gpAdmin","-password");
    if(!updateChat){
        res.status(400);
        throw new Error("add a name");
    }
    else{
        res.json(updateChat)
    }
})
const groupAdd=expressAsyncHandler(async (req,res)=>{
    const {chatId,userId}=req.body;
    const add=await Chats.findByIdAndUpdate(chatId,{$push:{users:userId}},{new:true}).populate("users","-password").populate("gpAdmin","-password");
    if(!add){
        res.status(400);
        throw new Error("add a valid user");
    }
    else{
        res.json(add);
    }

})
const groupRemove=expressAsyncHandler(async (req,res)=>{
    const {chatId,userId}=req.body;
    const remove=await Chats.findByIdAndUpdate(chatId,{$pull:{users:userId}},{new:true}).populate("users","-password").populate("gpAdmin","-password");
    if(!remove){
        res.status(400);
        throw new Error("add a valid user");
    }
    else{
        res.json(remove);
    }
    
})


module.exports={accessChats,fetchChats,createGroup,updateName,groupAdd,groupRemove};