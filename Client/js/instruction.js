
lucide.createIcons();

const checkBox = document.querySelector("#checkbox");
const startButton = document.getElementById("startbut");


const params = new URLSearchParams(window.location.search);
const examId = params.get("exam_id");

let examLoaded = false;

startButton.disabled = true;
startButton.style.cursor = "not-allowed";

function updateStartButton() {
    startButton.disabled = !(checkBox.checked && examLoaded);
    startButton.style.cursor = startButton.disabled ? "not-allowed" : "pointer";
}


async function loadExamInstructions() {
    try {
        if (!examId) {
            throw new Error("Exam ID is missing.");
        }

        const response = await fetch(
            `${API_BASE_URL}/api/student/examInstructions?exam_id=${encodeURIComponent(examId)}`,
            {
                method: "GET",
                credentials: "include"
            }
        );

        const data = await response.json();

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                window.location.href = "../auth/auth.html";
                return;
            }

            throw new Error(data.msg || "Unable to load exam instructions.");
        }

        const exam = data.exam;
        document.getElementById("examName").textContent = exam.title;
        document.getElementById("totalQuestions").textContent = exam.totalQuestions;
        document.getElementById("examDuration").textContent = `${exam.duration} Minutes`;
        document.getElementById("examTotalMarks").textContent = exam.total_marks;

        document.getElementById("summaryQuestions").textContent = exam.totalQuestions;
        document.getElementById("summaryDuration").textContent = `${exam.duration} Minutes`;
        document.getElementById("summaryMarks").textContent = exam.total_marks;

        document.getElementById("questionRule").textContent =
            `The exam contains ${exam.totalQuestions} questions.`;

        examLoaded = true;
        updateStartButton();

    } catch (error) {
        console.error("Exam instructions error:", error);
        alert(error.message);
    }
}


checkBox.addEventListener("change", () => {
    updateStartButton();
});


startButton.addEventListener("click", () => {
    if (!examLoaded || !checkBox.checked) return;

    window.location.href = `exam.html?exam_id=${encodeURIComponent(examId)}`;
});


loadExamInstructions();
