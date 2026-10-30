// Get HTML Elements
const searchResult = document.getElementById("searchResult");
const statusFilter = document.getElementById("statusFilter");

const resultTableBody = document.getElementById("resultTableBody");
const resultRows = document.querySelectorAll("#resultTableBody tr");

const noResults = document.getElementById("noResults");

const attemptedCount = document.getElementById("attemptedCount");
const passedCount = document.getElementById("passedCount");
const averageScore = document.getElementById("averageScore");

const resultDetails = document.getElementById("resultDetails");
const closeDetails = document.getElementById("closeDetails");


// Calculate Result Summary
let totalPassed = 0;
let totalPercentage = 0;

resultRows.forEach((row) => {
    const status = row.dataset.status;
    const percentageText = row.children[3].textContent;
    const percentage = parseFloat(percentageText);

    if (status === "passed") {
        totalPassed++;
    }

    totalPercentage += percentage;
});

attemptedCount.textContent = resultRows.length;
passedCount.textContent = totalPassed;

if (resultRows.length > 0) {
    averageScore.textContent =
        Math.round(totalPercentage / resultRows.length) + "%";
} else {
    averageScore.textContent = "0%";
}


// Search and Filter Results
function filterResults() {

    const searchText = searchResult.value.toLowerCase().trim();
    const selectedStatus = statusFilter.value;

    let visibleCount = 0;

    resultRows.forEach((row) => {

        const examName = row.children[0].textContent.toLowerCase();
        const examStatus = row.dataset.status;

        const matchesSearch = examName.includes(searchText);

        const matchesStatus =
            selectedStatus === "all" ||
            examStatus === selectedStatus;

        if (matchesSearch && matchesStatus) {
            row.style.display = "";
            visibleCount++;
        } else {
            row.style.display = "none";
        }

    });

    if (visibleCount === 0) {
        noResults.style.display = "block";
    } else {
        noResults.style.display = "none";
    }

}


// Search Event
searchResult.addEventListener("input", () => {
    filterResults();
});


// Filter Event
statusFilter.addEventListener("change", () => {
    filterResults();
});


// View Result Details
const viewButtons = document.querySelectorAll(".viewResult");

viewButtons.forEach((button) => {

    button.addEventListener("click", () => {

        document.getElementById("detailExamName").textContent =
            button.dataset.exam;

        document.getElementById("detailExamDate").textContent =
            button.dataset.date;

        document.getElementById("detailMarks").textContent =
            button.dataset.marks;

        document.getElementById("detailPercentage").textContent =
            button.dataset.percentage;

        document.getElementById("detailStatus").textContent =
            button.dataset.status;

        resultDetails.style.display = "block";

        resultDetails.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    });

});


// Close Result Details
closeDetails.addEventListener("click", () => {

    resultDetails.style.display = "none";

});


// Display Icons
lucide.createIcons();
