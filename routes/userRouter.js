import express from "express";
import auth from "../middlewares/auth.middleware.js";
const router=express.Router()
router.use(auth)   
router.get("/",(req,res)=>{
    const {name}=req.user
    res.render("index",{name})
})
router.get("/scan",(req,res)=>{
    res.render("scan")
})
router.get("/contact",(req,res)=>{
    res.render("contacts")
})
router.get("/history",(req,res)=>{
    const {history}=req.user
    res.render("history",{history})
})
export default router