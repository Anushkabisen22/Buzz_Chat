const mongoose=require('mongoose');
const Chats=require('./chatModel');
const messageSchema=new mongoose.Schema({
      sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
      },
      content:{
          type:String,
          trim:true
      },
      chat:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Chats"
      }

},{
  timestamps: true
})
module.exports=mongoose.model('Messages',messageSchema);