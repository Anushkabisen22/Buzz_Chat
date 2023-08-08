const mongoose =require('mongoose');
require('dotenv').config();

const mongoDB=async()=>{
    try{
        // const connect= await mongoose.connect(process.env.URL);
        const connect=await mongoose.connect("mongodb://127.0.0.1:27017/chatDB")   
        console.log('connected');
    }
    catch(err){
        console.log(err);
        process.exit(1);
    }
    
}
module.exports=mongoDB;