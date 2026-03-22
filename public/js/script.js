const openCamera = async () => {
  const video = document.getElementById('vid');
  const canvasElement = document.createElement('canvas'); 
  const canvas = canvasElement.getContext('2d', { willReadFrequently: true });
  let scanning = true; // Flag to stop the loop properly

  try {
    const constraints = {
      video: { 
        width: { ideal: 1280 }, 
        height: { ideal: 720 },
        facingMode: "environment" 
      },
      audio: false
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = stream;
    video.setAttribute("playsinline", true); 
    video.style.display = "block";
    await video.play();

    requestAnimationFrame(tick);
  } catch (error) {
    console.error("Camera Error:", error.name, error.message);
    alert("Camera access denied or not found.");
  }

  function tick() {
    if (!scanning) return; // Exit loop if we've already found a code

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvasElement.height = video.videoHeight;
      canvasElement.width = video.videoWidth;
      
      canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
      const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
      
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });

      if (code) {
        scanning = false; // Stop the loop immediately
        const data = code.data;
        
        // UPI IDs are often full URIs (upi://pay?pn=Name&am=10)
        // We need to parse the query string from the URI
        const url = new URL(data.replace('upi://pay', 'https://dummy.com'));
        const params = url.searchParams;
        
        const name = params.get("pn");
        const upi = params.get("pa") 
        const amount = params.get("am") || ""; // Amount is often optional in QR

        if (!name) {
          alert("Invalid UPI QR Code: " + data);
          scanning = true; // Resume scanning if invalid
          requestAnimationFrame(tick);
          return;
        }

        // FIX: Use window.location.href to redirect
        window.location.href = `confirm.html?name=${encodeURIComponent(name)}&am=${amount}&upi=${encodeURIComponent(upi)}`;
        return; 
      }
    }
    requestAnimationFrame(tick);
  }
};

openCamera();
