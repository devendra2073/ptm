const relogin=()=>{
      const pin=prompt("Please enter pin")
      if(!pin) relogin()
      localStorage.setItem("pin",pin)
     window.location.reload()
    }
   const login=()=>{ 
    let pin=localStorage.getItem("pin")
    if(!pin) return relogin()
    pin=parseInt(pin)
    fetch("https://ptm-lime.vercel.app/login",{
      method:"post",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({pin})
    }).then(e=>{
      try{
      return e.json()
      }
      catch(e){
        console.log(e);
        return relogin()
      }
    }).then(e=>{
      if(!e.status){
        relogin()
      }
      else{
      localStorage.setItem("token",e.token)
      }
    })
   }
   setTimeout(login, 2000);