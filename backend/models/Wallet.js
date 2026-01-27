const mongoose=require('mongoose');
module.exports=mongoose.model('Wallet',new mongoose.Schema({
 userId:String,balance:Number,points:Number
}));