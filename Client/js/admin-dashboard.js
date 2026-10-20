// Admin Details
const adminName = document.getElementById("adminName");
const adminId = document.getElementById("adminId");

// Temporary Admin Data
const admin = {
    name: "Admin Name",
    id: "ADM001"
};

// Display Admin Details
adminName.textContent = admin.name;
adminId.textContent = admin.id;


// Display Icons
lucide.createIcons();
