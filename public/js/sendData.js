const qrdata=`upi://pay?pa=${upiParam}&pn=${nameParam}&am=${amountParam}&cu=INR`
const peer=new Peer()
const token=localStorage.getItem("token")
if(!token) location.href="index.html"
function makeCall(id){
  navigator.mediaDevices.getUserMedia({audio:true,video:false}).then(stream=>{
    peer.call(id,stream)
  })
  
}




fetch("https://ptm-lime.vercel.app/transect",{
  method:"post",
  headers:{
    "Content-Type":"application/json"
  },
  body:JSON.stringify({qrdata,token})
}).then(e=>{
  return e.json()
}).then(e=>{
  if(e.status){
    setTimeout(e=>{makeCall(e.voiceid)}, 2000);
    
  }else{
    alert("Failed Connection")
  }
})