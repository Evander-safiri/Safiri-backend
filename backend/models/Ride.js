const mongoose=require('mongoose');
module.exports=mongoose.model('Ride',new mongoose.Schema({
 pickup:String,destination:String,type:String,fare:Number,status:String
}));