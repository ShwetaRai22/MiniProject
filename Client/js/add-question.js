
// Initialize Lucide Icons
lucide.createIcons();


// Add Question
const addQuestionBtn = document.getElementById("addQuestionBtn");
const questionContainer = document.querySelector(".questionContainer");

let questionCount = 1;


// Create New Question
addQuestionBtn.addEventListener("click", () => {

    const firstQuestion = document.querySelector(".questionCard");

    if (!validateQuestion(firstQuestion)) {
        alert("Please complete the current question before adding another.");
        return;
    }

    questionCount++;

    const newQuestion = firstQuestion.cloneNode(true);

    newQuestion.querySelector("h2").textContent = `Question ${questionCount}`;

    // Clear question text
    newQuestion.querySelector("#questionText").value = "";

    // Clear options and update IDs
    ["A", "B", "C", "D"].forEach(letter => {
        const optionInput = newQuestion.querySelector(`#option${letter}`);
        optionInput.value = "";
        optionInput.id = `option${letter}_${questionCount}`;

        newQuestion.querySelector(`label[for="option${letter}"]`).htmlFor =
            `option${letter}_${questionCount}`;
    });

    // Reset correct answer
    newQuestion.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.checked = false;
        radio.name = `correctAnswer_${questionCount}`;
    });

    // Clear marks
    newQuestion.querySelector("#questionMarks").value = "";

    // Update marks ID
    newQuestion.querySelector("#questionMarks").id =
        `questionMarks_${questionCount}`;

    newQuestion.querySelector('label[for="questionMarks"]').htmlFor =
        `questionMarks_${questionCount}`;

    // Insert new question before action buttons
    questionContainer.insertBefore(
        newQuestion,
        document.querySelector(".formActions")
    );

    lucide.createIcons();

});


// Validate a Question
function validateQuestion(card) {

    const question = card.querySelector("textarea").value.trim();

    const options = card.querySelectorAll('input[type="text"]');

    const correctAnswer = card.querySelector('input[type="radio"]:checked');

    const marks = card.querySelector('input[type="number"]').value;

    if (!question || !marks || Number(marks) <= 0) {
        return false;
    }

    for (let option of options) {
        if (!option.value.trim()) {
            return false;
        }
    }

    if (!correctAnswer) {
        return false;
    }

    return true;
}


// Save Questions
const saveQuestionsBtn = document.getElementById("saveQuestionsBtn");

saveQuestionsBtn.addEventListener("click", () => {

    const examSelect = document.getElementById("examSelect");

    if (!examSelect.value) {
        alert("Please select an examination first.");
        examSelect.focus();
        return;
    }

    const questionCards = document.querySelectorAll(".questionCard");

    for (let card of questionCards) {

        if (!validateQuestion(card)) {
            alert("Please complete all questions and select their correct answers.");
            card.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
            return;
        }

    }

    const questionsData = [];

    questionCards.forEach((card, index) => {

        const options = {};

        ["A", "B", "C", "D"].forEach(letter => {
            options[letter] = card.querySelector(
                `input[id^="option${letter}"]`
            ).value.trim();
        });

        questionsData.push({
            questionNumber: index + 1,
            question: card.querySelector("textarea").value.trim(),
            options: options,
            correctAnswer: card.querySelector('input[type="radio"]:checked').value,
            marks: Number(card.querySelector('input[type="number"]').value)
        });

    });

    const examData = {
        examId: examSelect.value,
        questions: questionsData
    };

    console.log("Questions Data:", examData);

    alert("All questions are validated. Backend integration is pending.");

});
