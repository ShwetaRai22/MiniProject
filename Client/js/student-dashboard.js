lucide.createIcons();
document.addEventListener('DOMContentLoaded', async (req, res) => {
    const studentName = document.getElementById("studentName");
    const studentId = document.getElementById("studentId");
    try {
        const response = await fetch(
            `${API_BASE_URL}/api/student/dashboard`,
            {
                method: "GET",
                credentials: "include"
            }
        );
        const data = await response.json();
      
        if (!response) {
            res.status(401).json({
                success: false,
                msg: "Unable to load dashboard."
            });
            window.location.href = "../auth/auth.html";
            return;
        }
        studentName.textContent = data.student.username;
        studentId.textContent = `STU00${data.student.student_id}`;
    } catch (error) {
        console.error("Dashboard loading error:", error);
        studentName.textContent = "Unable to load";
    }
await loadAvailableExams();
await loadRecentResults();
});
async function loadAvailableExams() {
    const examList = document.getElementById("examList");

    try {
        const response = await fetch(
            `${API_BASE_URL}/api/student/availableExams`,
            {
                method: "GET",
                credentials: "include"
            }
        );

        const data = await response.json();
        const availableExamCount = document.getElementById("availableExamCount");

availableExamCount.textContent = data.exams.filter(
    exam => exam.status !== "completed"
).length;
        if (!response.ok) {
            throw new Error(data.msg || "Unable to load exams.");
        }

        if (data.exams.length === 0) {
            examList.innerHTML = "<p>No available exams right now.</p>";
            return;
        }

        examList.innerHTML = data.exams.slice(0, 3).map(exam => `
            <div class="examCard">

                <div class="examTop">
                    <div class="examIcon">
                        <i data-lucide="code"></i>
                    </div>

                    <span class="examStatus">${exam.status}</span>
                </div>

                <h3>${exam.title}</h3>

                <p class="examDescription">
                    ${exam.subject}
                </p>

                <div class="examDetails">
                    <span>
                        <i data-lucide="clock"></i>
                        ${exam.duration} Minutes
                    </span>

                    <span>
                        <i data-lucide="list-checks"></i>
                        ${exam.totalQuestions} Questions
                    </span>
                </div>

                <a href="instruction.html?exam_id=${encodeURIComponent(exam.exam_id)}"
                    class="startExam">
                    ${exam.status === "completed" ? "View Exam" : "Start Exam"}
                    <i data-lucide="arrow-right"></i>
                </a>

            </div>
        `).join("");

        lucide.createIcons();

    } catch (error) {
        console.error("Available exams loading error:", error);
        examList.innerHTML = "<p>Unable to load available exams.</p>";
    }
}

async function loadRecentResults() {

    const resultTableBody = document.getElementById("resultTableBody");

    try {
        const response = await fetch(
            `${API_BASE_URL}/api/student/results`,
            {
                method: "GET",
                credentials: "include"
            }
        );

        const data = await response.json();
        const completedExamCount = document.getElementById("completedExamCount");
const averageScore = document.getElementById("averageScore");

completedExamCount.textContent = data.results.length;

const average = data.results.length > 0
    ? data.results.reduce((sum, result) => sum + Number(result.percentage), 0) / data.results.length
    : 0;

averageScore.textContent = `${average.toFixed(1)}%`;
        if (!response.ok) {
            throw new Error(data.msg || "Unable to load results.");
        }

        if (data.results.length === 0) {
            resultTableBody.innerHTML = `
                <tr>
                    <td colspan="4">No results available yet.</td>
                </tr>
            `;
            return;
        }

        resultTableBody.innerHTML = data.results.slice(0, 3).map(result => {

            const passed = result.status.toLowerCase() === "pass";

            return `
                <tr>
                    <td>${result.examName}</td>
                    <td>${result.resultDate}</td>
                    <td>${result.obtainedMarks}/${result.totalMarks}</td>
                    <td>
                        <span class="resultStatus ${passed ? "passed" : "failed"}">
                            ${passed ? "Passed" : "Failed"}
                        </span>
                    </td>
                </tr>
            `;

        }).join("");

    } catch (error) {
        console.error("Recent results loading error:", error);

        resultTableBody.innerHTML = `
            <tr>
                <td colspan="4">Unable to load results.</td>
            </tr>
        `;
    }
}