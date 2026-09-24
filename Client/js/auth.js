const studentBtn = document.querySelector("#studentBtn");
const adminBtn = document.querySelector("#adminBtn");

const studentForm = document.querySelector("#studentForm");
const adminForm = document.querySelector("#adminForm");
const signupLink = document.querySelector("#signupLink");
const studentLoginForm = document.querySelector("#studentLoginForm");
const adminLoginForm = document.querySelector("#adminLoginForm");

studentBtn.addEventListener("click", function () {

    studentForm.style.display = "block";
    adminForm.style.display = "none";
    studentBtn.classList.add("active");
    adminBtn.classList.remove("active");
    signupLink.href = "register.html?role=student";
});
studentLoginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    alert("Student login submitted!");
    window.location.href = "../student/dashboard.html";
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

    alert("Admin login submitted!");
    window.location.href = "../admin/dashboard.html";
});
