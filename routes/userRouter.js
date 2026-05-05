import express from "express";
import auth from "../middlewares/auth.middleware.js";
const router=express.Router()
router.use(auth)   
router.get("/",(req,res)=>{
    res.render("index")
})
export default router