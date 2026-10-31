
// Temporary sample exam data
// Later, this data will come from the backend API.

const exams = [

    {
        id: 1,
        name: "Mathematics Examination",
        subject: "Mathematics",
        date: "31 October 2026",
        time: "10:00 AM",
        duration: "60 Minutes",
        marks: 100,
        status: "live"
    },

    {
        id: 2,
        name: "Computer Science Test",
        subject: "Computer Science",
        date: "05 November 2026",
        time: "11:00 AM",
        duration: "90 Minutes",
        marks: 100,
        status: "upcoming"
    },

    {
        id: 3,
        name: "English Assessment",
        subject: "English",
        date: "08 November 2026",
        time: "09:00 AM",
        duration: "45 Minutes",
        marks: 50,
        status: "upcoming"
    },

    {
        id: 4,
        name: "Database Management Exam",
        subject: "DBMS",
        date: "20 October 2026",
        time: "02:00 PM",
        duration: "60 Minutes",
        marks: 100,
        status: "completed"
    },

    {
        id: 5,
        name: "Programming Fundamentals",
        subject: "Programming",
        date: "31 October 2026",
        time: "12:00 PM",
        duration: "60 Minutes",
        marks: 75,
        status: "live"
    },

    {
        id: 6,
        name: "Operating Systems Test",
        subject: "Operating Systems",
        date: "15 October 2026",
        time: "10:00 AM",
        duration: "60 Minutes",
        marks: 50,
        status: "completed"
    }

];


const examGrid = document.getElementById("examGrid");
const filterButtons = document.querySelectorAll(".filterBtn");
const noExams = document.getElementById("noExams");


// Display exam cards
function displayExams(examList) {

    examGrid.innerHTML = "";

    noExams.hidden = examList.length !== 0;

    examList.forEach(exam => {

        const card = document.createElement("div");
        card.classList.add("examCard");

        card.innerHTML = `
            <div class="cardHeader">
                <h3>${exam.name}</h3>
                <span class="status ${exam.status}">
                    ${exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                </span>
            </div>

            <p class="subject">Subject: ${exam.subject}</p>

            <div class="examInfo">

                <div class="infoItem">
                    <p>Exam Date</p>
                    <h4>${exam.date}</h4>
                </div>

                <div class="infoItem">
                    <p>Start Time</p>
                    <h4>${exam.time}</h4>
                </div>

                <div class="infoItem">
                    <p>Duration</p>
                    <h4>${exam.duration}</h4>
                </div>

                <div class="infoItem">
                    <p>Total Marks</p>
                    <h4>${exam.marks}</h4>
                </div>

            </div>

            <button class="startBtn"
                ${exam.status !== "live" ? "disabled" : ""}
                data-exam-id="${exam.id}">
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


// Initial display
displayExams(exams);
