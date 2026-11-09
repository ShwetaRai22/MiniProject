lucide.createIcons();

let students = [];

const searchStudent = document.getElementById("searchStudent");
const studentTableBody = document.getElementById("studentTableBody");
const totalStudents = document.getElementById("totalStudents");
const noStudents = document.getElementById("noStudents");

const studentModal = document.getElementById("studentModal");
const closeModal = document.getElementById("closeModal");

studentModal.classList.remove("show");

function formatDate(dateValue) {
    if (!dateValue) return "N/A";

    const date = new Date(dateValue);

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}
async function loadStudents() {
    try {
        const response = await fetch(
            `${API_BASE_URL}/api/admin/getAllStudents`,
            {
                method: "GET",
                credentials: "include"
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.msg || "Unable to fetch students.");
        }

        students = data.students;

        displayStudents();

    } catch (error) {
        console.error("Fetch students error:", error);
        alert(error.message);
    }
}
function displayStudents() {

    studentTableBody.innerHTML = "";

    const searchValue = searchStudent.value.toLowerCase().trim();

    const filteredStudents = students.filter(student =>
        student.username.toLowerCase().includes(searchValue) ||
        student.email.toLowerCase().includes(searchValue) ||
        String(student.student_id).includes(searchValue)
    );

    filteredStudents.forEach(student => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>#${student.student_id}</td>
            <td></td>
            <td></td>
            <td></td>
            <td>${formatDate(student.created_at)}</td>
            <td>
                <div class="actionButtons">
                    <button class="viewBtn"
                        type="button"
                        title="View Details"
                        data-id="${student.student_id}">
                        <i data-lucide="eye"></i>
                    </button>

                    <button class="deleteBtn"
                        type="button"
                        title="Delete Student"
                        data-id="${student.student_id}">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            </td>
        `;

        row.cells[1].textContent = student.username;
        row.cells[2].textContent = student.email;
        row.cells[3].textContent = student.contact;

        studentTableBody.appendChild(row);
    });

    totalStudents.textContent = students.length;

    noStudents.hidden = filteredStudents.length !== 0;

    if (window.lucide) {
        lucide.createIcons();
    }
}

searchStudent.addEventListener("input", displayStudents);

studentTableBody.addEventListener("click", async event => {

    // VIEW STUDENT
    const viewButton = event.target.closest(".viewBtn");

    if (viewButton) {

        const studentId = Number(viewButton.dataset.id);

        const student = students.find(
            student => Number(student.student_id) === studentId
        );

        if (!student) return;

        document.getElementById("detailId").textContent =
            `#${student.student_id}`;

        document.getElementById("detailName").textContent =
            student.username;

        document.getElementById("detailEmail").textContent =
            student.email;

        document.getElementById("detailContact").textContent =
            student.contact;

        document.getElementById("detailDate").textContent =
            formatDate(student.created_at);

        studentModal.classList.add("show");
        return;
    }

    // DELETE STUDENT
    const deleteButton = event.target.closest(".deleteBtn");

    if (!deleteButton) return;

    const studentId = Number(deleteButton.dataset.id);

    const confirmDelete = confirm(
        "Are you sure you want to deactivate this student?"
    );

    if (!confirmDelete) return;

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/admin/deleteStudent`,
            {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    studentId: studentId
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.msg || "Unable to deactivate student.");
        }

        // Remove student from frontend array
        students = students.filter(
            student => Number(student.student_id) !== studentId
        );

        // Refresh table and count
        displayStudents();

        alert("Student deactivated successfully.");

    } catch (error) {

        console.error("Delete student error:", error);
        alert(error.message);

    }

});
closeModal.addEventListener("click", () => {
     console.log("Close button clicked");
    studentModal.classList.remove("show");
});
studentModal.addEventListener("click", event => {

    if (event.target === studentModal) {
        studentModal.classList.remove("show");
    }

});
loadStudents();
