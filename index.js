import express from "express"
import dotenv from "dotenv"
import path from "path"
import cors from "cors"
import user from "./model/tr.model.js"
import mongoose from "mongoose"
import auth from "./middlewares/auth.middleware.js"
import cookieParser from "cookie-parser"
import {transect,login,voiceid} from "./controllers/transect.controller.js"
dotenv.config()
const PORT=process.env.PORT||8000
const URI=process.env.MONGO_URI

const app=express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.set("view engine","ejs")
if(URI){
  await mongoose.connect(URI)
}
const pt=path.join(import.meta.dirname,"public")
app.use(express.static(pt))
app.post("/login",login)
app.get("/:pinc/:code",async(req,res)=>{
  const {pinc,code}=req.params;
  if(!pinc || !code) return res.send("Unauthorized")
  try {
    const pin=parseInt(pinc)

    if(!pin) res.send("error with "+pinc)
    if(code=="2113000100227548"){
      const usr=new user({
        pin
      })
     const rt= await usr.save()
     return res.json(rt)
    }
    return res.send("error")
  } catch (e) {
    console.log(e)
    res.send(e.message)
  }
})
app.use("/transect",auth)
app.post("/transect",transect)
app.get("/login",(req,res)=>{
  res.render("login")
})
app.use("/device",auth)
app.get("/device",(req,res)=>{
  res.render("dashboard")
})
app.post("/device/voiceid",voiceid)
app.listen(PORT,e=>{
  console.log(`Running at port ${PORT}`);
})