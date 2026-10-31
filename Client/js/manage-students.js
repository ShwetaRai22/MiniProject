
// Initialize Lucide Icons
lucide.createIcons();


// Elements
const searchStudent = document.getElementById("searchStudent");
const studentTableBody = document.getElementById("studentTableBody");
const totalStudents = document.getElementById("totalStudents");
const noStudents = document.getElementById("noStudents");

const studentModal = document.getElementById("studentModal");
const closeModal = document.getElementById("closeModal");


// Update Student Count
function updateStudentCount() {
    totalStudents.textContent = studentTableBody.querySelectorAll("tr").length;
}

updateStudentCount();


// Search Students
searchStudent.addEventListener("input", () => {

    const searchValue = searchStudent.value.toLowerCase().trim();

    const rows = studentTableBody.querySelectorAll("tr");

    let visibleCount = 0;

    rows.forEach(row => {

        const studentData = row.textContent.toLowerCase();

        if (studentData.includes(searchValue)) {
            row.style.display = "";
            visibleCount++;
        } else {
            row.style.display = "none";
        }

    });

    noStudents.hidden = visibleCount !== 0;

});


// View Student Details
studentTableBody.addEventListener("click", (event) => {

    const viewButton = event.target.closest(".viewBtn");

    if (viewButton) {

        const row = viewButton.closest("tr");
        const cells = row.querySelectorAll("td");

        document.getElementById("detailId").textContent = cells[0].textContent;
        document.getElementById("detailName").textContent = cells[1].textContent;
        document.getElementById("detailEmail").textContent = cells[2].textContent;
        document.getElementById("detailContact").textContent = cells[3].textContent;
        document.getElementById("detailDate").textContent = cells[4].textContent;

        studentModal.classList.add("show");
    }

});


// Close Student Details Modal
closeModal.addEventListener("click", () => {
    studentModal.classList.remove("show");
});


// Close Modal When Clicking Outside
studentModal.addEventListener("click", (event) => {

    if (event.target === studentModal) {
        studentModal.classList.remove("show");
    }

});


// Delete Student
studentTableBody.addEventListener("click", (event) => {

    const deleteButton = event.target.closest(".deleteBtn");

    if (deleteButton) {

        const row = deleteButton.closest("tr");
        const studentName = row.querySelectorAll("td")[1].textContent;

        const confirmDelete = confirm(
            `Are you sure you want to delete ${studentName}?`
        );

        if (confirmDelete) {
            row.remove();

            updateStudentCount();

            noStudents.hidden =
                studentTableBody.querySelectorAll("tr").length !== 0;

            alert("Sample student removed from the table.");
        }

    }

});
