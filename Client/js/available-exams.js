const examGrid = document.getElementById("examGrid");
const filterButtons = document.querySelectorAll(".filterBtn");
const noExams = document.getElementById("noExams");

let exams = [];
async function loadExams() {
    try {
        const response = await fetch(
            `${API_BASE_URL}/api/student/availableExams`,
            {
                method: "GET",
                credentials: "include"
            }
        );

        const data = await response.json();
console.log("Available Exams API Response:", data);
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                window.location.href = "../auth/auth.html";
                return;
            }

            throw new Error(data.msg || "Unable to load exams.");
        }

        exams = data.exams;
        displayExams(exams);

    } catch (error) {
        console.error("Available exams loading error:", error);
        examGrid.innerHTML = "";
        noExams.textContent = "Unable to load examinations.";
        noExams.hidden = false;
    }
}

function displayExams(examList) {
    examGrid.innerHTML = "";

    noExams.textContent = "No exams available in this category.";
    noExams.hidden = examList.length !== 0;

    examList.forEach(exam => {
        const card = document.createElement("div");
        card.classList.add("examCard");

        card.innerHTML = `
            <div class="cardHeader">
                <h3>${exam.title}</h3>
                <span class="status ${exam.status}">
                    ${exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                </span>
            </div>

            <p class="subject">Subject: ${exam.subject}</p>

            <div class="examInfo">

                <div class="infoItem">
                    <p>Exam Date</p>
                    <h4>${exam.exam_date}</h4>
                </div>

                <div class="infoItem">
                    <p>Start Time</p>
                    <h4>${exam.exam_time}</h4>
                </div>

                <div class="infoItem">
                    <p>Duration</p>
                    <h4>${exam.duration} Minutes</h4>
                </div>

                <div class="infoItem">
                    <p>Total Marks</p>
                    <h4>${exam.total_marks}</h4>
                </div>

            </div>

            <button class="startBtn"
                ${exam.status !== "live" ? "disabled" : ""}
                data-exam-id="${exam.exam_id}">
                ${exam.status === "live"
                    ? "Start Exam"
                    : exam.status === "upcoming"
                    ? "Not Started Yet"
                    : "Exam Completed"}
            </button>
        `;

        examGrid.appendChild(card);
    });

}


// Filter exams
filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        const selectedFilter = button.dataset.filter;

        if (selectedFilter === "all") {
            displayExams(exams);
        } else {
            const filteredExams = exams.filter(
                exam => exam.status === selectedFilter
            );

            displayExams(filteredExams);
        }

    });

});
loadExams();
