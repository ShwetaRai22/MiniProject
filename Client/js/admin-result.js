
const resultsTableBody = document.getElementById("resultsTableBody");
const searchResult = document.getElementById("searchResult");
const examFilter = document.getElementById("examFilter");
const statusFilter = document.getElementById("statusFilter");

const noResultsMessage = document.getElementById("noResultsMessage");

const resultModal = document.getElementById("resultModal");
const resultDetails = document.getElementById("resultDetails");

const closeModal = document.getElementById("closeModal");
const closeModalBottom = document.getElementById("closeModalBottom");


// Sample Results Data

const results = [
    {
        studentId: "STU001",
        studentName: "Student One",
        exam: "Programming Fundamentals",
        score: 85,
        totalMarks: 100,
        status: "completed",
        date: "20 Oct 2026",
        correctAnswers: 26,
        incorrectAnswers: 4
    },

    {
        studentId: "STU002",
        studentName: "Student Two",
        exam: "Database Management",
        score: 72,
        totalMarks: 100,
        status: "completed",
        date: "22 Oct 2026",
        correctAnswers: 22,
        incorrectAnswers: 8
    },

    {
        studentId: "STU003",
        studentName: "Student Three",
        exam: "Web Development",
        score: null,
        totalMarks: 100,
        status: "in-progress",
        date: "25 Oct 2026",
        correctAnswers: null,
        incorrectAnswers: null
    },

    {
        studentId: "STU004",
        studentName: "Student Four",
        exam: "Programming Fundamentals",
        score: 91,
        totalMarks: 100,
        status: "completed",
        date: "20 Oct 2026",
        correctAnswers: 28,
        incorrectAnswers: 2
    },

    {
        studentId: "STU005",
        studentName: "Student Five",
        exam: "Database Management",
        score: 65,
        totalMarks: 100,
        status: "completed",
        date: "22 Oct 2026",
        correctAnswers: 20,
        incorrectAnswers: 10
    },

    {
        studentId: "STU006",
        studentName: "Student Six",
        exam: "Web Development",
        score: null,
        totalMarks: 100,
        status: "in-progress",
        date: "25 Oct 2026",
        correctAnswers: null,
        incorrectAnswers: null
    }
];


// Update Summary Cards

function updateSummary() {

    const total = results.length;

    const completed = results.filter(
        result => result.status === "completed"
    ).length;

    const inProgress = results.filter(
        result => result.status === "in-progress"
    ).length;

    const completedResults = results.filter(
        result => result.status === "completed"
    );

    let average = 0;

    if (completedResults.length > 0) {

        const totalPercentage = completedResults.reduce(
            (sum, result) => {
                return sum + (result.score / result.totalMarks) * 100;
            },
            0
        );

        average = Math.round(totalPercentage / completedResults.length);
    }

    document.getElementById("totalAttempts").textContent = total;
    document.getElementById("completedAttempts").textContent = completed;
    document.getElementById("progressAttempts").textContent = inProgress;
    document.getElementById("averageScore").textContent = average + "%";
}


// Populate Exam Filter

function populateExamFilter() {

    const exams = [...new Set(
        results.map(result => result.exam)
    )];

    exams.forEach(exam => {

        const option = document.createElement("option");

        option.value = exam;
        option.textContent = exam;

        examFilter.appendChild(option);
    });
}


// Display Results

function displayResults(data) {

    resultsTableBody.innerHTML = "";

    if (data.length === 0) {
        noResultsMessage.hidden = false;
        return;
    }

    noResultsMessage.hidden = true;

    data.forEach(result => {

        const percentage = result.score === null
            ? "--"
            : Math.round((result.score / result.totalMarks) * 100) + "%";

        const score = result.score === null
            ? "--"
            : `${result.score}/${result.totalMarks}`;

        const statusText = result.status === "completed"
            ? "Completed"
            : "In Progress";

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${result.studentId}</td>

            <td>${result.studentName}</td>

            <td>${result.exam}</td>

            <td>${score}</td>

            <td>${percentage}</td>

            <td>
                <span class="statusBadge ${result.status}">
                    ${statusText}
                </span>
            </td>

            <td>
                <button class="viewBtn" type="button">
                    <i data-lucide="eye"></i>
                    View
                </button>
            </td>
        `;

        row.querySelector(".viewBtn").addEventListener("click", () => {
            viewResult(result);
        });

        resultsTableBody.appendChild(row);
    });

    lucide.createIcons();
}


// Search and Filter Results

function filterResults() {

    const searchValue = searchResult.value.toLowerCase().trim();

    const selectedExam = examFilter.value;
    const selectedStatus = statusFilter.value;

    const filteredResults = results.filter(result => {

        const matchesSearch =
            result.studentId.toLowerCase().includes(searchValue) ||
            result.studentName.toLowerCase().includes(searchValue) ||
            result.exam.toLowerCase().includes(searchValue);

        const matchesExam =
            selectedExam === "all" || result.exam === selectedExam;

        const matchesStatus =
            selectedStatus === "all" || result.status === selectedStatus;

        return matchesSearch && matchesExam && matchesStatus;
    });

    displayResults(filteredResults);
}


// View Result Details

function viewResult(result) {

    const percentage = result.score === null
        ? "--"
        : Math.round((result.score / result.totalMarks) * 100) + "%";

    const score = result.score === null
        ? "Not available"
        : `${result.score}/${result.totalMarks}`;

    resultDetails.innerHTML = `
        <div class="detailItem">
            <strong>Student ID</strong>
            <span>${result.studentId}</span>
        </div>

        <div class="detailItem">
            <strong>Student Name</strong>
            <span>${result.studentName}</span>
        </div>

        <div class="detailItem">
            <strong>Examination</strong>
            <span>${result.exam}</span>
        </div>

        <div class="detailItem">
            <strong>Exam Date</strong>
            <span>${result.date}</span>
        </div>

        <div class="detailItem">
            <strong>Score</strong>
            <span>${score}</span>
        </div>

        <div class="detailItem">
            <strong>Percentage</strong>
            <span>${percentage}</span>
        </div>

        <div class="detailItem">
            <strong>Correct Answers</strong>
            <span>${result.correctAnswers ?? "--"}</span>
        </div>

        <div class="detailItem">
            <strong>Incorrect Answers</strong>
            <span>${result.incorrectAnswers ?? "--"}</span>
        </div>

        <div class="detailItem">
            <strong>Status</strong>
            <span>${result.status === "completed" ? "Completed" : "In Progress"}</span>
        </div>
    `;

    resultModal.hidden = false;
}


// Close Modal

function hideModal() {
    resultModal.hidden = true;
}

closeModal.addEventListener("click", hideModal);
closeModalBottom.addEventListener("click", hideModal);


// Close Modal When Clicking Outside

resultModal.addEventListener("click", (event) => {

    if (event.target === resultModal) {
        hideModal();
    }
});


// Search and Filter Event Listeners

searchResult.addEventListener("input", filterResults);

examFilter.addEventListener("change", filterResults);

statusFilter.addEventListener("change", filterResults);


// Initial Setup

resultModal.hidden = true;

updateSummary();
populateExamFilter();
displayResults(results);
