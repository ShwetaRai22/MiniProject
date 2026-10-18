const studentName = document.getElementById("studentName");
const studentId = document.getElementById("studentId");

// Temporary student data
const student = {
    name: "Student Name",
    id: "STU001"
};

// Display Student Details
studentName.textContent = student.name;
studentId.textContent = student.id;


// Display Icons
lucide.createIcons();