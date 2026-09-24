const studentForm = document.querySelector("#stuRegister form");
const adminForm = document.querySelector("#adminRegister form");
const studentInputs = studentForm.querySelectorAll('input[type="password"]');
const adminInputs = adminForm.querySelectorAll('input[type="password"]');
const studentUsername = document.querySelector("#studentUsername");
const adminUsername = document.querySelector("#adminUsername");
const studentContact = studentForm.querySelector('input[type="tel"]');
const adminContact = adminForm.querySelector('input[type="tel"]');
const stuRegister = document.querySelector("#stuRegister");
const adminRegister = document.querySelector("#adminRegister");
const params = new URLSearchParams(window.location.search);
const role = params.get("role");
if (role === "student") {
    stuRegister.style.display = "block";
    adminRegister.style.display = "none";
} 
else if (role === "admin") {
    stuRegister.style.display = "none";
    adminRegister.style.display = "block";
}
studentForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (studentUsername.value.trim() === "") {
    alert("Please enter a username!");
    return;
    }
    if (!/^\d{10}$/.test(studentContact.value)) {
    alert("Please enter a valid 10-digit contact number!");
    return;
}
if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}/.test(studentInputs[0].value)) {
    alert("Password must be at least 8 characters and contain uppercase, lowercase, and a number.");
    return;
}
if (studentInputs[1].value.trim() === "") {
    alert("Please confirm your password!");
    return;
}
    if (studentInputs[0].value !== studentInputs[1].value) {
        alert("Passwords do not match!");
        return;
    }
    alert("Student registration submitted!");
    window.location.href = "auth.html";
});

adminForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (adminUsername.value.trim() === "") {
    alert("Please enter a username!");
    return;
}
    if (!/^\d{10}$/.test(adminContact.value)) {
    alert("Please enter a valid 10-digit contact number!");
    return;
}
if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}/.test(adminInputs[0].value)) {
    alert("Password must be at least 8 characters and contain uppercase, lowercase, and a number.");
    return;
}
if (adminInputs[1].value.trim() === "") {
    alert("Please confirm your password!");
    return;
}
    if (adminInputs[0].value !== adminInputs[1].value) {
        alert("Passwords do not match!");
        return;
    }
    alert("Admin registration submitted!");
    window.location.href = "auth.html";
});

