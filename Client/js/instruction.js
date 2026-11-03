lucide.createIcons();
const checkBox= document.querySelector("#checkbox");
const startButton=document.getElementById("startbut");
startButton.style.cursor = "not-allowed";
startButton.disabled = true;
checkBox.addEventListener('change',()=>{
  if(checkBox.checked==true){
    startButton.disabled=false;
    startButton.style.cursor = "pointer";
  }
  else{
    startButton.disabled=true;
    
  }
});

startButton.addEventListener('click',()=>{
   console.log("Start button clicked!");
  window.location.href = "exam.html";
});