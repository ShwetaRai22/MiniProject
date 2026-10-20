const profileCard = document.getElementById("profileCard");

const editButton = document.getElementById("editProfile");
const saveButton = document.getElementById("saveProfile");
const cancelButton = document.getElementById("cancelEdit");

const usernameInput = document.getElementById("usernameInput");
const emailInput = document.getElementById("emailInput");
const contactInput = document.getElementById("contactInput");
const addressInput = document.getElementById("addressInput");

const viewValues = document.querySelectorAll(".viewValue");

const profileUsername = document.getElementById("profileUsername");

let oldUsername = usernameInput.value;
let oldEmail = emailInput.value;
let oldContact = contactInput.value;
let oldAddress = addressInput.value;


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
