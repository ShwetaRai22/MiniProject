
// Temporary sample result data
// Later, this data will come from the backend API.

const results = [

    {
        id: 1,
        name: "Mathematics Examination",
        subject: "Mathematics",
        date: "20 October 2026",
        marksObtained: 85,
        totalMarks: 100,
        percentage: 85,
        status: "passed"
    },

    {
        id: 2,
        name: "Computer Science Test",
        subject: "Computer Science",
        date: "15 October 2026",
        marksObtained: 72,
        totalMarks: 100,
        percentage: 72,
        status: "passed"
    },

    {
        id: 3,
        name: "English Assessment",
        subject: "English",
        date: "10 October 2026",
        marksObtained: 28,
        totalMarks: 50,
        percentage: 56,
        status: "passed"
    },

    {
        id: 4,
        name: "Database Management Exam",
        subject: "DBMS",
        date: "05 October 2026",
        marksObtained: 35,
        totalMarks: 100,
        percentage: 35,
        status: "failed"
    },

    {
        id: 5,
        name: "Programming Fundamentals",
        subject: "Programming",
        date: "28 September 2026",
        marksObtained: 65,
        totalMarks: 75,
        percentage: 86.67,
        status: "passed"
    },

    {
        id: 6,
        name: "Operating Systems Test",
        subject: "Operating Systems",
        date: "20 September 2026",
        marksObtained: 20,
        totalMarks: 50,
        percentage: 40,
        status: "failed"
    }

];


// DOM Elements

const resultGrid = document.getElementById("resultGrid");

const filterButtons = document.querySelectorAll(".filterBtn");

const noResults = document.getElementById("noResults");


// Summary Elements

const totalExams = document.getElementById("totalExams");

const passedExams = document.getElementById("passedExams");

const failedExams = document.getElementById("failedExams");


// Calculate Summary

function updateSummary() {

    const total = results.length;

    const passed = results.filter(
        result => result.status === "passed"
    ).length;

    const failed = results.filter(
        result => result.status === "failed"
    ).length;

    totalExams.textContent = total;

    passedExams.textContent = passed;

    failedExams.textContent = failed;

}


// Display Result Cards

function displayResults(resultList) {

    resultGrid.innerHTML = "";

    noResults.hidden = resultList.length !== 0;

    resultList.forEach(result => {

        const card = document.createElement("div");

        card.classList.add("resultCard");

        card.innerHTML = `

            <div class="cardHeader">

                <h3>${result.name}</h3>

                <span class="resultStatus ${result.status}">
                    ${result.status === "passed" ? "Passed" : "Failed"}
                </span>

            </div>


            <p class="subject">
                Subject: ${result.subject}
            </p>


            <div class="marksSection">

                <div class="marksHeading">

                    <p>Marks Obtained</p>

                    <h2>
                        ${result.marksObtained}/${result.totalMarks}
                    </h2>

                </div>


                <div class="progressTrack">

                    <div
                        class="progressFill ${result.status}"
                        style="width: ${result.percentage}%">
                    </div>

                </div>

            </div>


            <div class="resultInfo">

                <div class="infoItem">

                    <p>Exam Date</p>

                    <h4>${result.date}</h4>

                </div>


                <div class="infoItem">

                    <p>Percentage</p>

                    <h4>${result.percentage.toFixed(2)}%</h4>

                </div>

            </div>

        `;

        resultGrid.appendChild(card);

    });

}


// Filter Results

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        // Remove active class from all buttons

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });


        // Activate selected button

        button.classList.add("active");


        const selectedFilter = button.dataset.filter;


        if (selectedFilter === "all") {

            displayResults(results);

        } else {

            const filteredResults = results.filter(
                result => result.status === selectedFilter
            );

            displayResults(filteredResults);

        }

    });

});


// Initial Page Load

updateSummary();

displayResults(results);
