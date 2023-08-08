const expressAsyncHandler = require("express-async-handler");
const Messages=require('../Models/messageModel');
const User=require('../Models/userModel');
const Chat=require('../Models/chatModel');
const sendMessage=expressAsyncHandler(async(req,res)=>{
       const {content,chatId}=req.body;
       if(!content || !chatId){
        console.log("invalid message");
        return res.sendStatus(400);
       }
       var newMsg={
        
        sender:req.user.id,
        content:content,
        chat:chatId
       }                                          
       try {
           var message=await Messages.create(newMsg);
           message=await message.populate("sender","name pic"); 
           message=await message.populate("chat"); 
           message=await User.populate(message,{
            path:"chat.users",
            select:"name pic email"
           }); 
           await Chat.findByIdAndUpdate(chatId,{
            lastMsg:message
           });
           res.json(message);
       } catch (error) {
           res.status(400);
           throw new Error(error.message);
       }
})
const fetchMessage=expressAsyncHandler(async(req,res)=>{
    try {
        const messages=await Messages.find({chat:req.params.chatId}).populate("sender","name pic email")
        .populate("chat");
        res.json(messages);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
})

module.exports={sendMessage,fetchMessage};