import data from "../model/tr.model.js"
import jwt from "jsonwebtoken"

const transect=async(req,res)=>{
  try {
    const {pin}=req.user
    const {qrdata,name,amount,refn,upi}=req.body
    if(!pin || !qrdata ) return res.json({status:false,message:"Missing details"})
    const tr=await data.findOne({pin})
    tr.qrdata=qrdata;
    const hst={name,amount,refn,upi}
    const hstr=tr.history;
    tr.history=[...hstr,hst]
    tr.amount+=amount
    
    await tr.save()
    return res.json({status:true,message:"Done",voiceid:tr.voiceid})
  } catch (e) {
    res.json({status:false,message:e.message})
  }
}
const login=async(req,res)=>{
  let {pin,id}=req.body;
  if(!pin) return res.json({status:false})
  pin=parseInt(pin)
  if(!pin) return res.json({status:false})
  const usr=await data.findOne({pin})
  if (!usr) return res.json({status:false})
  if(id && !usr.deviceid){
    usr.deviceid=id;
    await usr.save();
  }
  if(!id || id==usr.deviceid){
  const token=await jwt.sign({pin:usr.pin},process.env.JWT)
  res.cookie("session",token,{
    httpOnly:true,
    expiresIn:24*60*60*1000
  })
return   res.json({status:true,token})
  }
  return res.json({status:false})
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
const qr=async(req,res)=>{
  const {pin}=req.user
  if(!pin) return res.json({status:false})
  const user=await data.findOne({pin})
  const {qrdata}=user;
  const image=`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrdata)}`
  res.json({image,pin})
  
}
export  {transect,login,voiceid,qr};
