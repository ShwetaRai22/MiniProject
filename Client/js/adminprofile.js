const profileCard = document.getElementById("profileCard");

const editButton = document.getElementById("editProfile");
const saveButton = document.getElementById("saveProfile");
const cancelButton = document.getElementById("cancelEdit");
const logoutButton = document.getElementById("logOut");
const usernameInput = document.getElementById("usernameInput");
const emailInput = document.getElementById("emailInput");
const contactInput = document.getElementById("contactInput");
const addressInput = document.getElementById("addressInput");
const adminId = document.getElementById("adminId");
const viewValues = document.querySelectorAll(".viewValue");

let oldUsername = "";
let oldEmail = "";
let oldContact = "";
let oldAddress = "";
document.addEventListener('DOMContentLoaded', async () => {
   
    try {
        
        const response = await fetch(
            `${API_BASE_URL}/api/admin/profile`,
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

        const admin = data.admin;
        document.querySelectorAll(".profileUsername").forEach(element => {
            element.textContent = admin.username;
        });
        adminId.textContent = `Admin ID: ADM00${admin.admin_id}`;
        document.getElementById("adminContact").textContent = admin.contact;
        document.getElementById("adminEmail").textContent = admin.email;
        document.getElementById("adminAddress").textContent = admin.address;

        usernameInput.value = admin.username;
        emailInput.value = admin.email;
        contactInput.value = admin.contact;
        addressInput.value = admin.address;

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
// Edit Profile
editButton.addEventListener("click", () => {
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

        const response = await fetch(`${API_BASE_URL}/api/admin/profile`,
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

       

        if (response.status === 401) {
            window.location.href = "../auth/auth.html";
            return;
        }
         const data = await response.json();
        if (!response.ok) {
            throw new Error(data.msg || data.message || "Unable to update profile.");
        }

        const admin = data.admin;

        document.querySelectorAll(".profileUsername").forEach(element => {
            element.textContent = admin.username;
        });
        adminId.textContent = `Admin ID: ADM00${admin.admin_id}`;
        adminContact.textContent = admin.contact;
        adminEmail.textContent=admin.email;
        adminAddress.textContent = admin.address;

        usernameInput.value = admin.username;
        emailInput.value = admin.email;
        contactInput.value = admin.contact;
        addressInput.value = admin.address;
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


// Cancel Editing
cancelButton.addEventListener("click", () => {

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
            `${API_BASE_URL}/api/admin/logout`,
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