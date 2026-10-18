const studentBtn = document.querySelector("#studentBtn");
const adminBtn = document.querySelector("#adminBtn");

const studentForm = document.querySelector("#studentForm");
const adminForm = document.querySelector("#adminForm");
const signupLink = document.querySelector("#signupLink");
const studentLoginForm = document.querySelector("#studentLoginForm");
const adminLoginForm = document.querySelector("#adminLoginForm");
const studentPassword = document.querySelector('#studentPassword');
const admintPassword = document.querySelector('#adminPassword');
studentBtn.addEventListener("click", function () {

    studentForm.style.display = "block";
    adminForm.style.display = "none";
    studentBtn.classList.add("active");
    adminBtn.classList.remove("active");
    signupLink.href = "register.html?role=student";
});
studentLoginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

     const username = document.querySelector("#studentUsername").value.trim();
    const password = document.querySelector("#studentPassword").value;
    const button = document.querySelector("#studentLoginButton");

    if (!username || !password) {
        alert("Please enter your username and password.");
        return;
    }

    button.disabled = true;
    button.textContent = "Signing In...";

    try {
        const response = await fetch(
            "/api/auth/student/signin",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || data.msg || "Login failed.");
            return;
        }

        alert("Login successful!");

        window.location.href = "../student/dashboard.html";

    } catch (error) {
        console.error("Login error:", error);
        alert("Unable to connect to the server. Please try again.");
    } finally {
        button.disabled = false;
        button.textContent = "Sign In";
    }
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
