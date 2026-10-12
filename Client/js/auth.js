const studentBtn = document.querySelector("#studentBtn");
const adminBtn = document.querySelector("#adminBtn");

const studentForm = document.querySelector("#studentForm");
const adminForm = document.querySelector("#adminForm");
const signupLink = document.querySelector("#signupLink");
const studentLoginForm = document.querySelector("#studentLoginForm");
const adminLoginForm = document.querySelector("#adminLoginForm");
const studentPassword = document.querySelector('#stPass');
const admintPassword = document.querySelector('#adPass');
studentBtn.addEventListener("click", function () {

    studentForm.style.display = "block";
    adminForm.style.display = "none";
    studentBtn.classList.add("active");
    adminBtn.classList.remove("active");
    signupLink.href = "register.html?role=student";
});
studentLoginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (studentPassword.value.length < 8) {
    alert("Password must be atleast 8 characters long.");
    return;
    }
    else{
    alert("Student login submitted!");
    studentLoginForm.reset();
    window.location.href = "../student/dashboard.html";}
    
});
adminBtn.addEventListener("click", function () {

    studentForm.style.display = "none";
    adminForm.style.display = "block";
    adminBtn.classList.add("active");
    studentBtn.classList.remove("active");
    signupLink.href = "register.html?role=admin";
});
adminLoginForm.addEventListener("submit", function (event) {
    event.preventDefault();
     if (admintPassword.value.length < 8) {
    alert("Password must be atleast 8 characters long.");
    return;
    }
    else{ alert("Admin login submitted!");
    adminLoginForm.reset();
    window.location.href = "../admin/dashboard.html";} 
});
