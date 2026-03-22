import data from "../model/tr.model.js"
import jwt from "jsonwebtoken"

const transect=async(req,res)=>{
  try {
    const {pin}=req.user
    const {qrdata}=req.body
    if(!pin || !qrdata ) return res.json({status:false,message:"Missing details"})
    const tr=await data.findOne({pin})
    tr.qrdata=qrdata;
    await tr.save()
    return res.json({status:true,message:"Done"})
  } catch (e) {
    res.json({status:false,message:e.message})
  }
}
const login=async(req,res)=>{
  let {pin}=req.body;
  if(!pin) return res.json({status:false})
  pin=parseInt(pin)
  if(!pin) return res.json({status:false})
  const usr=await data.findOne({pin})
  if (!usr) return res.json({status:false})
  const token=await jwt.sign({pin:usr.pin},process.env.JWT)
  res.cookie("session",token,{
    httpOnly:true,
    expiresIn:24*60*60*1000
  })
  res.json({status:true})
  
}
const voiceid=async(req,res)=>{
  const {pin}=req.user
  const {voiceid}=req.body
  if(!pin || !voiceid) return res.json({status:false,message:"Pin error or voiceid error"})
  const user=await data.findOne({pin})
  if(!user) return res.json({status:false,message:"Data error"})
  user.voiceid=voiceid
  await user.save()
  res.json({status:true,message:"Voice id registered"})
}
export  {transect,login,voiceid};
