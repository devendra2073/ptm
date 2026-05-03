import {Schema,model} from "mongoose"
const schema=new Schema({
  pin:{
    type:Number,
    unique:true
  },
  name:{
type:String
  },
  qrdata:String,
  voiceid:String,
  deviceid:{
    type:String,
    unique:true,
  },
  history:[
    {
      amount:Number,
      payee:String,
      reference:String
    }
  ]
  
})
const tr=model("fake",schema)
export default tr;