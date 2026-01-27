const r=require('express').Router();
const Wallet=require('../models/Wallet');
r.post('/add-points',async(req,res)=>res.json(
 await Wallet.findOneAndUpdate({userId:req.body.userId},{ $inc:{points:req.body.points}},{new:true})
));
module.exports=r;