const profileCard = document.getElementById("profileCard");

const editButton = document.getElementById("editProfile");
const saveButton = document.getElementById("saveProfile");
const cancelButton = document.getElementById("cancelEdit");

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


// Save Changes
saveButton.addEventListener("click", () => {

    if (
        usernameInput.value.trim() === "" ||
        emailInput.value.trim() === "" ||
        contactInput.value.trim() === "" ||
        addressInput.value.trim() === ""
    ) {
        alert("Please fill in all the fields.");
        return;
    }

    if (!emailInput.checkValidity()) {
        alert("Please enter a valid email address.");
        return;
    }

    viewValues[0].textContent = usernameInput.value.trim();
    viewValues[1].textContent = emailInput.value.trim();
    viewValues[2].textContent = contactInput.value.trim();
    viewValues[3].textContent = addressInput.value.trim();

    profileUsername.textContent = usernameInput.value.trim();

    oldUsername = usernameInput.value.trim();
    oldEmail = emailInput.value.trim();
    oldContact = contactInput.value.trim();
    oldAddress = addressInput.value.trim();

    profileCard.classList.remove("editMode");

    alert("Admin profile updated successfully!");
});


// Cancel Editing
cancelButton.addEventListener("click", () => {

    usernameInput.value = oldUsername;
    emailInput.value = oldEmail;
    contactInput.value = oldContact;
    addressInput.value = oldAddress;

    profileCard.classList.remove("editMode");
});
