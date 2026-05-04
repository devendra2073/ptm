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
  limit:Number,
  amount:{
    type:Number,
    default:0
  },
  history:[
    {
      amount:Number,
      name:String,
      refn:String,
      upi:String
    }
  ]
  
})
const tr=model("fake",schema)
export default tr;