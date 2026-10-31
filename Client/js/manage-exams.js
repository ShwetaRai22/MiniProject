
/* =====================================
   SAMPLE EXAMINATION DATA
===================================== */

let exams = [
    {
        id: 101,
        title: "Mathematics Mid-Term",
        subject: "Mathematics",
        date: "2026-11-15",
        duration: 60,
        questions: 30,
        totalMarks: 60,
        passingMarks: 24,
        status: "scheduled"
    },
    {
        id: 102,
        title: "Computer Science Test",
        subject: "Computer Science",
        date: "2026-11-10",
        duration: 90,
        questions: 40,
        totalMarks: 100,
        passingMarks: 40,
        status: "live"
    },
    {
        id: 103,
        title: "English Grammar Exam",
        subject: "English",
        date: "2026-11-05",
        duration: 45,
        questions: 25,
        totalMarks: 50,
        passingMarks: 20,
        status: "completed"
    },
    {
        id: 104,
        title: "Physics Practice Test",
        subject: "Physics",
        date: "2026-11-20",
        duration: 60,
        questions: 0,
        totalMarks: 50,
        passingMarks: 20,
        status: "draft"
    },
    {
        id: 105,
        title: "Database Management Exam",
        subject: "Computer Science",
        date: "2026-11-12",
        duration: 75,
        questions: 35,
        totalMarks: 70,
        passingMarks: 28,
        status: "in-progress"
    }
];


/* =====================================
   GET HTML ELEMENTS
===================================== */

const examTableBody = document.getElementById("examTableBody");

const totalExams = document.getElementById("totalExams");
const scheduledExams = document.getElementById("scheduledExams");
const liveExams = document.getElementById("liveExams");
const completedExams = document.getElementById("completedExams");

const searchExam = document.getElementById("searchExam");
const statusFilter = document.getElementById("statusFilter");
const noExamsMessage = document.getElementById("noExamsMessage");

const examModal = document.getElementById("examModal");
const examDetails = document.getElementById("examDetails");
const closeModal = document.getElementById("closeModal");



// Make sure modal stays hidden on page load.
examModal.hidden = true;

function getStatusLabel(status) {

    const labels = {
        "draft": "Draft",
        "scheduled": "Scheduled",
        "live": "Live",
        "in-progress": "In Progress",
        "completed": "Completed"
    };

    return labels[status] || status;
}

function formatDate(date) {

    const examDate = new Date(date + "T00:00:00");

    return examDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

function updateSummary() {

    totalExams.textContent = exams.length;

    scheduledExams.textContent = exams.filter(
        exam => exam.status === "scheduled"
    ).length;

    liveExams.textContent = exams.filter(
        exam =>
            exam.status === "live" ||
            exam.status === "in-progress"
    ).length;

    completedExams.textContent = exams.filter(
        exam => exam.status === "completed"
    ).length;
}

function displayExams() {

    examTableBody.innerHTML = "";

    const searchValue = searchExam.value.toLowerCase().trim();
    const selectedStatus = statusFilter.value;

    const filteredExams = exams.filter(exam => {

        const matchesSearch =
            exam.title.toLowerCase().includes(searchValue) ||
            exam.subject.toLowerCase().includes(searchValue) ||
            String(exam.id).includes(searchValue);

        const matchesStatus =
            selectedStatus === "all" ||
            exam.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });


    filteredExams.forEach(exam => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>#${exam.id}</td>

            <td>
                <span class="examName">${exam.title}</span>
                <span class="examSubject">${exam.subject}</span>
            </td>

            <td>${formatDate(exam.date)}</td>

            <td>${exam.duration} min</td>

            <td>${exam.questions}</td>

            <td>
                <span class="statusBadge status-${exam.status}">
                    ${getStatusLabel(exam.status)}
                </span>
            </td>

            <td>
                <div class="actionButtons">

                    <button type="button"
                        class="actionBtn"
                        title="View Details"
                        data-action="view"
                        data-id="${exam.id}">
                        <i data-lucide="eye"></i>
                    </button>

                    <button type="button"
                        class="actionBtn"
                        title="Change Status"
                        data-action="status"
                        data-id="${exam.id}">
                        <i data-lucide="refresh-cw"></i>
                    </button>

                    <button type="button"
                        class="actionBtn deleteBtn"
                        title="Delete Exam"
                        data-action="delete"
                        data-id="${exam.id}">
                        <i data-lucide="trash-2"></i>
                    </button>

                </div>
            </td>
        `;

        examTableBody.appendChild(row);
    });


    noExamsMessage.hidden = filteredExams.length !== 0;

    updateSummary();

    if (window.lucide) {
        lucide.createIcons();
    }
}

function viewExam(id) {

    const exam = exams.find(exam => exam.id === id);

    if (!exam) return;

    examDetails.innerHTML = `
        <div class="detailItem">
            <strong>Exam ID:</strong>
            <span>#${exam.id}</span>
        </div>

        <div class="detailItem">
            <strong>Exam Title:</strong>
            <span>${exam.title}</span>
        </div>

        <div class="detailItem">
            <strong>Subject:</strong>
            <span>${exam.subject}</span>
        </div>

        <div class="detailItem">
            <strong>Exam Date:</strong>
            <span>${formatDate(exam.date)}</span>
        </div>

        <div class="detailItem">
            <strong>Duration:</strong>
            <span>${exam.duration} minutes</span>
        </div>

        <div class="detailItem">
            <strong>Total Questions:</strong>
            <span>${exam.questions}</span>
        </div>

        <div class="detailItem">
            <strong>Total Marks:</strong>
            <span>${exam.totalMarks}</span>
        </div>

        <div class="detailItem">
            <strong>Passing Marks:</strong>
            <span>${exam.passingMarks}</span>
        </div>

        <div class="detailItem">
            <strong>Status:</strong>
            <span class="statusBadge status-${exam.status}">
                ${getStatusLabel(exam.status)}
            </span>
        </div>
    `;

    // Open modal ONLY when this function is called.
    examModal.hidden = false;

    if (window.lucide) {
        lucide.createIcons();
    }
}


function changeExamStatus(id) {

    const exam = exams.find(exam => exam.id === id);

    if (!exam) return;

    const newStatus = prompt(
        "Enter new status:\n" +
        "1. Draft\n" +
        "2. Scheduled\n" +
        "3. Live\n" +
        "4. In Progress\n" +
        "5. Completed"
    );

    if (newStatus === null) return;

    const statusOptions = {
        "1": "draft",
        "2": "scheduled",
        "3": "live",
        "4": "in-progress",
        "5": "completed"
    };

    if (!statusOptions[newStatus.trim()]) {
        alert("Invalid status selection.");
        return;
    }

    exam.status = statusOptions[newStatus.trim()];

    displayExams();

    alert("Exam status updated successfully.");
}

function deleteExam(id) {

    const exam = exams.find(exam => exam.id === id);

    if (!exam) return;

    const confirmDelete = confirm(
        `Are you sure you want to delete "${exam.title}"?`
    );

    if (!confirmDelete) return;

    exams = exams.filter(exam => exam.id !== id);

    displayExams();

    alert("Exam deleted successfully.");
}

examTableBody.addEventListener("click", function(event) {

    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const id = Number(button.dataset.id);
    const action = button.dataset.action;

    if (action === "view") {

        viewExam(id);

    } else if (action === "status") {

        changeExamStatus(id);

    } else if (action === "delete") {

        deleteExam(id);
    }

});

searchExam.addEventListener("input", displayExams);

statusFilter.addEventListener("change", displayExams);


closeModal.addEventListener("click", function() {

    examModal.hidden = true;

});


examModal.addEventListener("click", function(event) {

    if (event.target === examModal) {

        examModal.hidden = true;

    }

});

displayExams();
