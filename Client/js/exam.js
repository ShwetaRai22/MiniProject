
const questionText = document.getElementById("questionText");
const questionNumber = document.getElementById("questionNumber");
const questionMarks = document.getElementById("questionMarks");

const optionsContainer = document.getElementById("optionsContainer");
const questionGrid = document.getElementById("questionGrid");

const previousBtn = document.getElementById("previousBtn");
const nextBtn = document.getElementById("nextBtn");

const timerDisplay = document.getElementById("timer");

const submitExam = document.getElementById("submitExam");
const submitModal = document.getElementById("submitModal");

const cancelSubmit = document.getElementById("cancelSubmit");
const confirmSubmit = document.getElementById("confirmSubmit");
const resultModal = document.getElementById("resultModal");

const resultScore = document.getElementById("resultScore");
const resultPercentage = document.getElementById("resultPercentage");
const resultStatus = document.getElementById("resultStatus");

const resultCorrect = document.getElementById("resultCorrect");
const resultIncorrect = document.getElementById("resultIncorrect");
const resultUnanswered = document.getElementById("resultUnanswered");
const resultTotal = document.getElementById("resultTotal");

const answerReviewContainer =
    document.getElementById("answerReviewContainer");

const resultDone = document.getElementById("resultDone");
let currentQuestion = 0;
let remainingTime = 30 * 60;
let timerInterval;
let examSubmitted = false;
let questions = [];
let answers = [];
let attemptId = null;

async function loadExamQuestions() {
    try {
        const params = new URLSearchParams(window.location.search);
        const examId = params.get("exam_id");

        if (!examId) {
            throw new Error("Exam ID is missing.");
        }
        const startResponse = await fetch(
            `${API_BASE_URL}/api/student/startExam`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ examId })
            }
        );

        const startData = await startResponse.json();

        if (!startResponse.ok) {
            throw new Error(startData.msg || "Unable to start exam.");
        }

        attemptId = startData.attemptId;
        remainingTime = startData.remainingSeconds;

        const response = await fetch(
            `${API_BASE_URL}/api/student/examQuestions?exam_id=${encodeURIComponent(examId)}`,
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

            throw new Error(data.msg || "Unable to load exam questions.");
        }

        // Store questions received from the backend
        questions = data.questions.map(question => ({
            question_id: question.question_id,
            question: question.question_text,
            marks: question.marks,
            options: question.options.map(option => option.option_text),
            optionIds: question.options.map(option => option.option_id)
        }));

        // Initialize student answers
        answers = new Array(questions.length).fill(null);

        // Display questions
        createQuestionGrid();
        displayQuestion();
        startTimer();

    } catch (error) {
        console.error("Load exam questions error:", error);
        alert(error.message);
    }
}

// Create Question Navigation Buttons

function createQuestionGrid() {

    questionGrid.innerHTML = "";

    questions.forEach((question, index) => {

        const button = document.createElement("button");

        button.type = "button";
        button.textContent = index + 1;
        button.className = "questionNumberBtn";

        button.addEventListener("click", () => {
            currentQuestion = index;
            displayQuestion();
        });

        questionGrid.appendChild(button);
    });

    document.getElementById("totalQuestions").textContent =
        questions.length;
}


// Display Current Question

function displayQuestion() {

    const question = questions[currentQuestion];

    questionNumber.textContent = `Question ${currentQuestion + 1}`;

    questionText.textContent = question.question;

    questionMarks.textContent =
        `${question.marks} ${question.marks === 1 ? "Mark" : "Marks"}`;

    optionsContainer.innerHTML = "";

    question.options.forEach((option, index) => {

        const label = document.createElement("label");

        label.className = "optionLabel";

        if (answers[currentQuestion] === index) {
            label.classList.add("selected");
        }

        label.innerHTML = `
            <input
                type="radio"
                name="answer"
                value="${index}"
                ${answers[currentQuestion] === index ? "checked" : ""}
            >

            <span class="optionLetter">
                ${String.fromCharCode(65 + index)}.
            </span>

            <span>${option}</span>
        `;

        const radio = label.querySelector("input");

        radio.addEventListener("change", () => {

            answers[currentQuestion] = index;

            displayQuestion();
        });

        optionsContainer.appendChild(label);
    });


    // Update Previous and Next Buttons

    previousBtn.disabled = currentQuestion === 0;

    nextBtn.disabled = currentQuestion === questions.length - 1;


    // Highlight Current Navigation Button

    document.querySelectorAll(".questionNumberBtn").forEach(
        (button, index) => {

            button.classList.toggle(
                "active",
                index === currentQuestion
            );
        }
    );

    updateAnsweredCount();
}


// Update Answered Questions Count

function updateAnsweredCount() {

    const answered = answers.filter(
        answer => answer !== null
    ).length;

    document.getElementById("answeredQuestions").textContent =
        answered;
}


// Previous Question

previousBtn.addEventListener("click", () => {

    if (currentQuestion > 0) {

        currentQuestion--;

        displayQuestion();
    }
});


// Next Question

nextBtn.addEventListener("click", () => {

    if (currentQuestion < questions.length - 1) {

        currentQuestion++;

        displayQuestion();
    }
});


// Countdown Timer

function startTimer() {

    updateTimerDisplay();

    timerInterval = setInterval(() => {

        remainingTime--;

        updateTimerDisplay();

        if (remainingTime <= 0) {

            clearInterval(timerInterval);
            finishExam();
        }

    }, 1000);
}


function updateTimerDisplay() {

    const minutes = Math.floor(remainingTime / 60);

    const seconds = remainingTime % 60;

    timerDisplay.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

}


// Open Submit Confirmation Modal

submitExam.addEventListener("click", () => {

    const answered = answers.filter(
        answer => answer !== null
    ).length;

    document.getElementById("modalTotal").textContent =
        questions.length;

    document.getElementById("modalAnswered").textContent =
        answered;

    document.getElementById("modalUnanswered").textContent =
        questions.length - answered;

    submitModal.hidden = false;

});


// Cancel Submission

cancelSubmit.addEventListener("click", () => {

    submitModal.hidden = true;

});


// Confirm Submission

confirmSubmit.addEventListener("click", () => {

    finishExam();

});


// Finish Examination


function finishExam() {

    // Prevent the exam from being submitted more than once
    if (examSubmitted) return;

    examSubmitted = true;

    clearInterval(timerInterval);

    submitModal.hidden = true;

    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;
    let obtainedMarks = 0;

    answerReviewContainer.innerHTML = "";

    questions.forEach((question, index) => {

        const selectedAnswer = answers[index];
        const correctAnswer = question.correctAnswer;

        let status = "";

        if (selectedAnswer === null) {
            unanswered++;
            status = "Unanswered";
        }
        else if (selectedAnswer === correctAnswer) {
            correct++;
            obtainedMarks += question.marks;
            status = "Correct";
        }
        else {
            incorrect++;
            status = "Incorrect";
        }

        const reviewItem = document.createElement("div");
        reviewItem.className = "reviewItem";

        const questionHeading = document.createElement("h4");
        questionHeading.textContent =
            `Question ${index + 1}: ${question.question}`;

        const selectedText = document.createElement("p");
        selectedText.textContent =
            `Your Answer: ${selectedAnswer === null
                ? "Not Answered"
                : question.options[selectedAnswer]
            }`;

        const correctText = document.createElement("p");
        correctText.textContent =
            `Correct Answer: ${question.options[correctAnswer]}`;

        const statusText = document.createElement("strong");
        statusText.textContent = status;

        statusText.className =
            status.toLowerCase();

        reviewItem.append(
            questionHeading,
            selectedText,
            correctText,
            statusText
        );

        answerReviewContainer.appendChild(reviewItem);

    });

    const totalMarks = questions.reduce(
        (total, question) => total + question.marks,
        0
    );

    const percentage = totalMarks > 0
        ? (obtainedMarks / totalMarks) * 100
        : 0;

    resultScore.textContent =
        `${obtainedMarks} / ${totalMarks}`;

    resultPercentage.textContent =
        `${percentage.toFixed(2)}%`;

    resultStatus.textContent =
        percentage >= 40 ? "Passed" : "Failed";

    resultCorrect.textContent = correct;
    resultIncorrect.textContent = incorrect;
    resultUnanswered.textContent = unanswered;
    resultTotal.textContent = questions.length;

    resultModal.hidden = false;

    lucide.createIcons();
}

resultDone.addEventListener("click", () => {
    window.location.href = "dashboard.html";
});

loadExamQuestions();

