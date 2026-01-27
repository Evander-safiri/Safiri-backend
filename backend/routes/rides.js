const r=require('express').Router();
const Ride=require('../models/Ride');
r.post('/request',async(req,res)=>res.json(await new Ride(req.body).save()));
module.exports=r;