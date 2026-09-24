const frt = document.querySelector("#frt");
const vfy = document.querySelector("#vfy");
const newpass = document.querySelector("#newpass");
const sendBtn = document.querySelector("#butsend");
const verifyBtn = document.querySelector("#butvfy");

sendBtn.addEventListener("click", function () {

    frt.style.opacity = "0";
    frt.style.visibility = "hidden";

    vfy.style.opacity = "1";
    vfy.style.visibility = "visible";
    startTimer();

});
verifyBtn.addEventListener("click", function (event) {
    event.preventDefault();
    vfy.style.opacity = "0";
    vfy.style.visibility = "hidden";
    newpass.style.opacity = "1";
    newpass.style.visibility = "visible";
});

let timeLeft = 45;
const timer = document.querySelector("#timer");
const resendOtp = document.querySelector("#resendOtp");
let countdown;
function startTimer() {
    // Clear previous timer
    clearInterval(countdown);
    timeLeft = 45;
    resendOtp.disabled = true;
    timer.textContent = "(00:45)";
    countdown = setInterval(function () {
        timeLeft--;
        let seconds = timeLeft < 10
            ? "0" + timeLeft: timeLeft;
        timer.textContent = "(00:" + seconds + ")";
        if (timeLeft <= 0) {
            clearInterval(countdown);
            timer.textContent = "";
            resendOtp.disabled = false;
        }
    }, 1000);
}

resendOtp.addEventListener("click", function () {
    alert("New OTP has been sent!");
    startTimer();

});
const newPassword = document.querySelector("#newPassword");
const confirmPassword = document.querySelector("#confirmPassword");
const resetBtn = document.querySelector("#butnew");

resetBtn.addEventListener("click", function (event) {

    event.preventDefault();

    if (newPassword.value === "") {
        alert("Please enter your new password.");
        return;
    }
    if (newPassword.value.length < 8) {
    alert("Password must be atleast 8 characters long.");
    return;
    }
    if (confirmPassword.value === "") {
        alert("Please confirm your password.");
        return;
    }
    if (newPassword.value !== confirmPassword.value) {
    alert("Passwords do not match.");
    return;
}
   
alert("Password reset successfully!");
});