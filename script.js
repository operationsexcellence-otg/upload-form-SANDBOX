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
    xhr.open("POST","https://default2e0f74ad066f44ea9cf9557b3c2f8d.49.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/65342f7c857c426a9261ecdf20b640e8/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=ZJ8XkmkLidoYcDS5xtk3aUA0nEKIs18j4rnVi31BCHc");
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

  const baseUrl = "https://forms.office.com/Pages/ResponsePage.aspx?id=rXQPLm8G6kSc-VV7PC-NSeWT8yXfPp1Jnc9wKq4L7J9UMERCSURWRVg1SThXVkhVU1hYSTZSVzNSTi4u&r388ad2dde4704c85a4bfca0f7a0468b8=0001&r598411bb4c17426b92deb8699b9b1fe2=%22Batam%22";
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

// Loader hide when iframe loads
msFormFrame.onload = function(){
  document.getElementById('loader').style.display='none';
  msFormFrame.style.display='block';
};
