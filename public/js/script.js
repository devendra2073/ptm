const video = document.getElementById('vid');
const fileInput = document.getElementById('file-selector');
const canvasElement = document.createElement('canvas');
const canvas = canvasElement.getContext('2d', { willReadFrequently: true });

let scanning = true;
let videoTrack = null;
let lastScanTime = 0;
const SCAN_INTERVAL = 200; // ms

const openCamera = async () => {
    try {
        const constraints = {
            video: { 
                width: { ideal: 1280 }, 
                height: { ideal: 720 },
                facingMode: "environment" 
            }
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;
        videoTrack = stream.getVideoTracks()[0];
        
        video.setAttribute("playsinline", true);
        video.style.display = "block";
        await video.play();

        requestAnimationFrame(tick);
    } catch (error) {
        console.error("Camera Error:", error);
        alert("Camera access denied.");
    }
};

// Continuous Scan Loop
function tick(time) {
    if (!scanning) return;

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        if (time - lastScanTime >= SCAN_INTERVAL) {
            lastScanTime = time;
            canvasElement.height = video.videoHeight;
            canvasElement.width = video.videoWidth;
            canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
            
            const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);

            if (code) {
                handleQRCode(code.data);
                return; 
            }
        }
    }
    requestAnimationFrame(tick);
}

// Unified Handler for UPI logic
function handleQRCode(data) {
    if (!data.startsWith("upi://pay")) {
        console.log("Not a UPI QR");
        return;
    }

    scanning = false;
    // Stop camera tracks to save battery/privacy
    if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
    }

    const params = new URLSearchParams(data.split('?')[1]);
    const name = params.get("pn") || "Unknown";
    const upi = params.get("pa") || "";
    const amount = params.get("am") || "";

    if (!upi) {
        alert("Invalid UPI: Missing Payee Address");
        scanning = true;
        openCamera(); // Restart
        return;
    }

    window.location.href = `confirm.html?name=${encodeURIComponent(name)}&am=${amount}&upi=${encodeURIComponent(upi)}`;
}

// --- NEW: Torch Control ---
async function toggleTorch() {
    if (!videoTrack) return;
    
    try {
        const capabilities = videoTrack.getCapabilities();
        if (capabilities.torch) {
            const currentSetting = videoTrack.getSettings().torch;
            await videoTrack.applyConstraints({
                advanced: [{ torch: !currentSetting }]
            });
        } else {
            alert("Torch not supported on this device.");
        }
    } catch (e) {
        console.error("Torch error:", e);
    }
}

// --- NEW: File Chooser Logic ---
fileInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
        const img = new Image();
        img.onload = () => {
            canvasElement.width = img.width;
            canvasElement.height = img.height;
            canvas.drawImage(img, 0, 0);
            const imgData = canvas.getImageData(0, 0, img.width, img.height);
            const code = jsQR(imgData.data, imgData.width, imgData.height);
            
            if (code) {
                handleQRCode(code.data);
            } else {
                alert("No QR code found in this image.");
            }
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

// Start on Load
openCamera();
