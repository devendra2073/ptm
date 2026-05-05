import jwt from "jsonwebtoken"
import user from "../model/tr.model.js"
const auth=async(req,res,next)=>{
  try {
    const {session}=req.cookies || req.body
    if(!session) return res.render("403")
    const token=await jwt.verify(session,process.env.JWT)
    if(!token) return res.render("403")
    const usr=await user.findOne({pin:token.pin})
    if(!usr) return res.render("403")
    req.user=usr
    return next()
    
  } catch (e) {
    return res.send(e.message)
  }
}

export default auth;