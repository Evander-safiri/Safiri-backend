const mongoose=require('mongoose');
module.exports=mongoose.model('User',new mongoose.Schema({
 name:String,phone:String,role:String,carType:String,points:Number
}));