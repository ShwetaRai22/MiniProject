
const profileCard = document.getElementById("profileCard");

const editButton = document.getElementById("editProfile");
const saveButton = document.getElementById("saveProfile");
const cancelButton = document.getElementById("cancelEdit");
const logoutButton = document.getElementById("logOut");


const usernameInput = document.getElementById("usernameInput");
const emailInput = document.getElementById("emailInput");
const contactInput = document.getElementById("contactInput");
const addressInput = document.getElementById("addressInput");

const viewValues = document.querySelectorAll(".viewValue");

const studentid = document.getElementById("studentid");
const phoneon = document.getElementById("phoneno");
const studentemail = document.getElementById("studentemail");
const studentaddress = document.getElementById("studentaddress");
let oldUsername = "";
let oldEmail = "";
let oldContact = "";
let oldAddress = "";
document.addEventListener('DOMContentLoaded', async () => {
   
    try {
        
        const response = await fetch(
            '/api/student/profile',
            {
                method: 'GET',
                credentials: "include"
            }
        );
    
        const data = await response.json();
        
        if (response.status === 401) {
            window.location.href = "../auth/auth.html";
            return;
        }
        if (!response.ok) {
            throw new Error(data.msg || data.message || "Unable to load profile.");
        }

        const student = data.student;
        document.querySelectorAll(".profileUsername").forEach(element => {
            element.textContent = student.username;
        });
        studentid.textContent = `Student ID: STU00${student.student_id}`;
        phoneon.textContent = student.contact;
        studentemail.textContent=student.email;
        studentaddress.textContent = student.address;

        usernameInput.value = student.username;
        emailInput.value = student.email;
        contactInput.value = student.contact;
        addressInput.value = student.address;

        saveOldValues();
    } catch (error) {
        console.error("Profile loading error:", error);
        alert("Unable to load your profile. Please try again.");
    }
});
function saveOldValues() {
    oldUsername = usernameInput.value;
    oldEmail = emailInput.value;
    oldContact = contactInput.value;
    oldAddress = addressInput.value;
}

editButton.addEventListener('click', () => {

    profileCard.classList.add("editMode");

});

saveButton.addEventListener('click', async () => {

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const contact = contactInput.value.trim();
    const address = addressInput.value.trim();

    if(!username || !email || !contact || !address){
        alert("Please fill in all the fields.");
        return;
    }

    if (!emailInput.checkValidity()) {
        alert("Please enter a valid email address.");
        return;
    }

    try {
        saveButton.disabled = true;

        const response = await fetch('/api/student/profile',
            {
                method: 'PUT',
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    email,
                    contact,
                    address
                })
            });

        const data = await response.json();

        if (response.status === 401) {
            window.location.href = "../auth/auth.html";
            return;
        }
        if (!response.ok) {
            throw new Error(data.msg || data.message || "Unable to update profile.");
        }

        const student = data.student;

        document.querySelectorAll(".profileUsername").forEach(element => {
            element.textContent = student.username;
        });
        studentid.textContent = `Student ID: STU00${student.student_id}`;
        phoneon.textContent = student.contact;
        studentemail.textContent=student.email;
        studentaddress.textContent = student.address;

        usernameInput.value = student.username;
        emailInput.value = student.email;
        contactInput.value = student.contact;
        addressInput.value = student.address;
        saveOldValues();

        profileCard.classList.remove("editMode");

        alert(data.msg || data.message || "Profile updated successfully!");
    } catch (error) {
        console.error("Profile update error:", error);
        alert(error.message || "Unable to update your profile.");
    } finally {
        saveButton.disabled = false;
    }
});



cancelButton.addEventListener('click', () => {

    usernameInput.value = oldUsername;
    emailInput.value = oldEmail;
    contactInput.value = oldContact;
    addressInput.value = oldAddress;

    profileCard.classList.remove("editMode");

});

logoutButton.addEventListener('click', async()=>{
    console.log("button clicked");
    try {
        const response= await fetch(
            '/api/student/logout',
            {
                method:'POST',
                credentials:'include'

            }
        );

        const data= await response.json();
        console.log("Logout status:", response.status);
        console.log("Logout response:", data);
        if(!response.ok){
            throw new Error(data.msg||"logout failed")
        }
        alert("Logout successful!");
        window.location.href='../auth/auth.html';
    } catch (error) {
        console.error("Logout error:", error);
       alert(error.message || "Unable to logout. Please try again.");
    }
});
