import {Schema,model} from "mongoose"
const schema=new Schema({
  pin:{
    type:Number,
    unique:true
  },
  qrdata:String,
  voiceid:String,
  
})
const tr=model("fake",schema)
export default tr;