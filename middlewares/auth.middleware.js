import jwt from "jsonwebtoken"
import user from "../model/tr.model.js"
const auth=async(req,res,next)=>{
  try {
    const {session}=req.cookies
    if(!session) return res.redirect("/login")
    const token=await jwt.verify(session,process.env.JWT)
    if(!token) return res.redirect("/login")
    const usr=await user.findOne({pin:token.pin})
    if(!usr) return res.redirect("/login")
    req.user=usr
    return next()
    
  } catch (e) {
    return res.send(e.message)
  }
}

export default auth;