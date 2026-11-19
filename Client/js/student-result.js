
const resultGrid = document.getElementById("resultGrid");
const filterButtons = document.querySelectorAll(".filterBtn");
const noResults = document.getElementById("noResults");

const totalExams = document.getElementById("totalExams");
const passedExams = document.getElementById("passedExams");
const failedExams = document.getElementById("failedExams");

let results = [];

// Fetch results from backend
async function loadStudentResults() {
    try {
        const response = await fetch(
            `${API_BASE_URL}/api/student/results`,
            {
                method: "GET",
                credentials: "include"
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.msg || "Unable to load results.");
        }

        results = data.results.map(result => ({
            ...result,
            status: result.status.toLowerCase()
        }));

        updateSummary();
        displayResults(results);

    } catch (error) {
        console.error("Load student results error:", error);
        alert(error.message);
    }
}

// Update summary cards
function updateSummary() {

    const total = results.length;

    const passed = results.filter(
        result => result.status === "pass"
    ).length;

    const failed = results.filter(
        result => result.status === "fail"
    ).length;

    totalExams.textContent = total;
    passedExams.textContent = passed;
    failedExams.textContent = failed;
}

// Display result cards
function displayResults(resultList) {

    resultGrid.innerHTML = "";

    noResults.hidden = resultList.length !== 0;

    resultList.forEach(result => {

        const card = document.createElement("div");

        card.classList.add("resultCard");

        card.innerHTML = `
            <div class="cardHeader">
                <h3>${result.examName}</h3>

                <span class="resultStatus ${result.status}">
                    ${result.status === "pass" ? "Passed" : "Failed"}
                </span>
            </div>

            <p class="subject">
                Subject: ${result.subject}
            </p>

            <div class="marksSection">

                <div class="marksHeading">
                    <p>Marks Obtained</p>

                    <h2>
                        ${result.obtainedMarks}/${result.totalMarks}
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
                    <h4>${result.resultDate}</h4>
                </div>

                <div class="infoItem">
                    <p>Percentage</p>
                    <h4>${Number(result.percentage).toFixed(2)}%</h4>
                </div>

            </div>
        `;

        resultGrid.appendChild(card);
    });
}

// Filter results
filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        const selectedFilter = button.dataset.filter;

        if (selectedFilter === "all") {
            displayResults(results);
        } else {
            const filteredResults = results.filter(
                result => result.status ===
                    (selectedFilter === "passed" ? "pass" : "fail")
            );

            displayResults(filteredResults);
        }
    });
});

// Initial page load
loadStudentResults();
