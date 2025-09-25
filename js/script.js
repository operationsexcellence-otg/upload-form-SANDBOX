function generateCode(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({length}, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
}

const uploadForm = document.getElementById('uploadForm');
const message = document.getElementById('message');
const codeDisplay = document.getElementById('generatedCode');
const progressContainer = document.getElementById('progressContainer');
const progressBar = document.getElementById('progressBar');
const continueBtn = document.getElementById('continueBtn');
const finishBtn = document.getElementById('finishBtn');
const countdownMsg = document.getElementById('countdownMsg');
const countdownSpan = document.getElementById('countdown');
const msFormFrame = document.getElementById('msFormFrame');

let submissionID = "";

uploadForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];
  if (!file) { message.style.color="red"; message.textContent="Please select a file."; return; }

  message.textContent = "⏳ Uploading..."; message.style.color="black";
  progressContainer.style.display = "block"; progressBar.style.width = "0%";

  submissionID = generateCode();
  const newFileName = `${submissionID}-${file.name}`;
  const reader = new FileReader();

  reader.onload = function() {
    const base64Data = reader.result.split(",")[1];
    const body = JSON.stringify({
      filename: newFileName,
      file: base64Data,
      contentType: file.type || "application/octet-stream"
    });

    const xhr = new XMLHttpRequest();
    xhr.open("POST","YOUR_POWER_AUTOMATE_ENDPOINT_HERE");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.upload.onprogress = function(e){
      if(e.lengthComputable){ progressBar.style.width = (e.loaded/e.total*100)+"%"; }
    };

    xhr.onload = function() {
      if(xhr.status>=200 && xhr.status<300){
        message.style.color="green";
        message.textContent="✅ File uploaded successfully!";
        codeDisplay.textContent="Submission ID: "+submissionID;
        continueBtn.style.display="block";
      } else { message.style.color="red"; message.textContent="❌ Upload failed: "+xhr.responseText; }
    };
    xhr.onerror = function(){ message.style.color="red"; message.textContent="❌ Upload error."; };
    xhr.send(body);
  };

  reader.readAsDataURL(file);
});

continueBtn.addEventListener("click", ()=>{
  document.getElementById('uploadSection').style.display="none";
  document.getElementById('formSection').style.display="block";

  const baseUrl = "YOUR_MS_FORM_PREFILLED_LINK_HERE";
  msFormFrame.src = `${baseUrl}&red1c88014cb24ac99c1bc085902d6354=${submissionID}`;

  finishBtn.style.display="block";
});

finishBtn.addEventListener("click", ()=>{
  finishBtn.style.display="none";
  countdownMsg.style.display="block";
  let counter = 3;
  countdownSpan.textContent = counter;
  const interval = setInterval(()=>{
    counter--;
    countdownSpan.textContent = counter;
    if(counter===0){
      clearInterval(interval);
      window.close();
    }
  },1000);
});
