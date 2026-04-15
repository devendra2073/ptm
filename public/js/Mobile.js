function parseMobileNumber(phoneStr) {
  if (!phoneStr) return null;

  // 1. Remove ONLY common formatting characters
  // This keeps letters and unexpected symbols intact for validation
  const cleanFormatting = phoneStr.replace(/[\s\-\(\)\+]/g, '');

  // 2. Check: Does it contain anything OTHER than digits?
  // If it has letters (like 'a' or 'b'), it's an invalid number.
  if (/\D/.test(cleanFormatting)) {
    return null; 
  }

  // 3. Now that we know it's pure digits, get the last 10
  if (cleanFormatting.length >= 10) {
    const lastTen = cleanFormatting.slice(-10);
    
    // Ensure it follows a standard 10-digit format (not starting with 0/1)
    return /^[2-9]\d{9}$/.test(lastTen) ? lastTen : null;
  }

  return null;
}

const getToday=()=>{
  const dt=new Date();
  let day=dt.toLocaleString()
  day=day.split(",")[0].split("/")
  day[2]=day[2].slice(-2)
  return day.join("-")
}


const sendSms=async(phone,amount)=>{
  const message=`A/c XX${phone.slice(-4)} credited with ${amount} on ${getToday()} by UPI Ref No ${Math.floor(Math.random()*999999999999)}. Check balance in your app`
  
  const phn=parseMobileNumber(phone);
  if(!window.Android?.sendSms||!phn){
    return "Not able to send Sms"
  }
  
  await Android.sendSms(phn,message)
  return true
  
}
