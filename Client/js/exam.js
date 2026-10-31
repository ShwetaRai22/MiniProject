
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

let currentQuestion = 0;
let remainingTime = 30 * 60;
let timerInterval;


// Sample Questions

const questions = [

    {
        question: "Which language is primarily used to structure web pages?",
        options: [
            "CSS",
            "HTML",
            "JavaScript",
            "Python"
        ],
        marks: 1
    },

    {
        question: "Which HTML tag is used to create a hyperlink?",
        options: [
            "<link>",
            "<href>",
            "<a>",
            "<hyperlink>"
        ],
        marks: 1
    },

    {
        question: "Which CSS property is used to change the text color?",
        options: [
            "font-style",
            "background-color",
            "color",
            "text-decoration"
        ],
        marks: 1
    },

    {
        question: "Which keyword is used to declare a variable in JavaScript?",
        options: [
            "var",
            "define",
            "int",
            "string"
        ],
        marks: 1
    },

    {
        question: "Which symbol is used for single-line comments in JavaScript?",
        options: [
            "<!-- -->",
            "//",
            "##",
            "**"
        ],
        marks: 1
    },

    {
        question: "Which HTML attribute specifies an image source?",
        options: [
            "href",
            "link",
            "src",
            "alt"
        ],
        marks: 1
    },

    {
        question: "Which CSS layout system is designed for one-dimensional layouts?",
        options: [
            "Grid",
            "Flexbox",
            "Float",
            "Position"
        ],
        marks: 1
    },

    {
        question: "Which method selects an element by its ID in JavaScript?",
        options: [
            "getElementById()",
            "getElementsByClass()",
            "queryAll()",
            "selectId()"
        ],
        marks: 1
    },

    {
        question: "What does CSS stand for?",
        options: [
            "Computer Style Sheets",
            "Creative Style System",
            "Cascading Style Sheets",
            "Colorful Style Sheets"
        ],
        marks: 1
    },

    {
        question: "Which HTML element is used to create an unordered list?",
        options: [
            "<ol>",
            "<ul>",
            "<li>",
            "<list>"
        ],
        marks: 1
    }

];


// Store Student Answers

const answers = new Array(questions.length).fill(null);


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

            alert("Time is over! Your examination will be submitted.");

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

    clearInterval(timerInterval);

    submitModal.hidden = true;

    const answered = answers.filter(
        answer => answer !== null
    ).length;

    alert(
        `Examination submitted successfully!\n\n` +
        `Total Questions: ${questions.length}\n` +
        `Answered: ${answered}\n` +
        `Unanswered: ${questions.length - answered}`
    );

    // Backend submission and result saving will be connected later.
}


// Initial Setup

createQuestionGrid();

displayQuestion();

startTimer();

lucide.createIcons();
