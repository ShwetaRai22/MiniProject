
const examForm = document.getElementById("examForm");

const examDate = document.getElementById("examDate");
const startTime = document.getElementById("startTime");
const endTime = document.getElementById("endTime");
const duration = document.getElementById("duration");
const totalMarks = document.getElementById("totalMarks");
const passingMarks = document.getElementById("passingMarks");


// Initialize Lucide Icons
lucide.createIcons();


// Prevent selecting a past date
const currentDate = new Date();

const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, "0");
const day = String(currentDate.getDate()).padStart(2, "0");

const today = `${year}-${month}-${day}`;

examDate.min = today;


// Reset Form
examForm.addEventListener("reset", () => {

    setTimeout(() => {
        examForm.classList.remove("wasSubmitted");
    }, 0);

});


// Create Exam Form Submission
examForm.addEventListener("submit", (event) => {

    event.preventDefault();


    // Get Form Values
    const title = document.getElementById("examTitle").value.trim();
    const subjectName = document.getElementById("subject").value.trim();

    const start = startTime.value;
    const end = endTime.value;

    const examDuration = Number(duration.value);
    const total = Number(totalMarks.value);
    const passing = Number(passingMarks.value);


    // Validate Exam Timing
    if (end <= start) {
        alert("End time must be after start time.");
        return;
    }


    // Validate Marks
    if (passing > total) {
        alert("Passing marks cannot be greater than total marks.");
        return;
    }


    // Prepare Exam Data
    const examData = {
        title: title,
        subject: subjectName,
        examDate: examDate.value,
        startTime: start,
        endTime: end,
        duration: examDuration,
        totalMarks: total,
        passingMarks: passing
    };


    fetch(`${API_BASE_URL}/api/admin/createExams`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(examData)
})
.then(async response => {
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.msg || "Unable to create exam.");
    }

    alert("Exam created successfully!");
    examForm.reset();
})
.catch(error => {
    console.error("Create exam error:", error);
    alert(error.message);
});
})
