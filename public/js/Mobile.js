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
  day=day.reverse()
  return day.join("-")
}


const sendSms=(phone,amount)=>{
  const dt=new Date()
  const time=dt.toLocaleTimeString('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: true
});
  const message=`Dear UPI User: Your account is credited with INR ${amount}.00 on ${getToday()} ${time} by UPI Ref No ${Math.floor(Math.random()*999999999999)}; - UPI`
  
  const phn=parseMobileNumber(phone);
  if(!window.Android?.sendSms||!phn){
    return "Not able to send Sms"
  }
  
  return {number:phn,message}
  
}
