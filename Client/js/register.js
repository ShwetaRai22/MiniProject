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
studentForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = studentUsername.value.trim();
    const email = studentForm.querySelector('[name="email"]').value.trim();
    const contact = studentContact.value.trim();
    const address = studentForm.querySelector('[name="address"]').value.trim();
    const password = studentInputs[0].value;
    const confirmPassword = studentInputs[1].value;

    if (!username || !email || !contact || !address || !password || !confirmPassword) {
        alert("Please fill in all fields!");
        return;
    }

    if (!/^[0-9]{10}$/.test(contact)) {
        alert("Please enter a valid 10-digit contact number!");
        return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)) {
        alert("Password must be at least 8 characters and contain uppercase, lowercase, and a number.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }
    const registerButton = studentForm.querySelector('button[type="submit"]');
    registerButton.disabled = true;
    registerButton.textContent = "Registering...";

    try {
        const response = await fetch(
            `${API_BASE_URL}/api/auth/student/signup`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    email,
                    contact,
                    address,
                    password,
                    confirmPassword
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Registration failed. Please try again.");
            return;
        }

        alert("Student registration successful!");
        window.location.href = "auth.html";

    } catch (error) {
        console.error("Registration request failed:", error);
        alert("Could not connect to the server. Please make sure the backend is running.");
    } finally {
        registerButton.disabled = false;
        registerButton.textContent = "Register";
    }
});

adminForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = adminUsername.value.trim();
    const email = adminForm.querySelector('[name="email"]').value.trim();
    const contact = adminContact.value.trim();
    const address = adminForm.querySelector('[name="address"]').value.trim();
    const password = adminInputs[0].value;
    const confirmPassword = adminInputs[1].value;

    if (!username || !email || !contact || !address || !password || !confirmPassword) {
        alert("Please fill in all fields!");
        return;
    }

    if (!/^[0-9]{10}$/.test(contact)) {
        alert("Please enter a valid 10-digit contact number!");
        return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)) {
        alert("Password must be at least 8 characters and contain uppercase, lowercase, and a number.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }
    const registerButton = adminForm.querySelector('button[type="submit"]');
    registerButton.disabled = true;
    registerButton.textContent = "Registering...";

    try {
        const response = await fetch(
            `${API_BASE_URL}/api/auth/admin/signup`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    email,
                    contact,
                    address,
                    password,
                    confirmPassword
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Registration failed. Please try again.");
            return;
        }

        alert("Admin registration successful!");
        window.location.href = "auth.html";

    } catch (error) {
        console.error("Registration request failed:", error);
        alert("Could not connect to the server. Please make sure the backend is running.");
    } finally {
        registerButton.disabled = false;
        registerButton.textContent = "Register";
    }
});