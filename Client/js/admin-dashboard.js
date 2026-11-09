lucide.createIcons();
document.addEventListener('DOMContentLoaded', async (req, res) => {
    const adminName = document.getElementById("adminName");
    const adminId = document.getElementById("adminId");
    try {
        const response = await fetch(
            `${API_BASE_URL}/api/admin/dashboard`,
            {
                method: "GET",
                credentials: "include"
            }
        );
        const data = await response.json();
        if (!response.ok) {
            // res.status(401).json({
            //     success:false,
            //     msg:"Unable to load dashboard."
            // });
            window.location.href = "../auth/auth.html";
            return;
        }
        adminName.textContent = data.admin.username;
        adminId.textContent = `ADM00${data.admin.admin_id}`;
        document.getElementById("totalStudents").textContent =
            data.totalStudents;

        document.getElementById("totalExams").textContent = data.totalExams;

        document.getElementById("publishedExams").textContent = data.publishedExams;
        const examTableBody = document.getElementById("examTableBody");

        if (data.recentExams.length === 0) {
            examTableBody.innerHTML = `
        <tr>
            <td colspan="4">No examinations found.</td>
        </tr>
    `;
        } else {
            examTableBody.innerHTML = data.recentExams.map(exam => `
        <tr>
            <td>${exam.title}</td>
            <td>${new Date(exam.exam_date + "T00:00:00").toLocaleDateString("en-GB")}</td>
            <td>${exam.total_questions}</td>
            <td>
                <span class="statusBadge ${exam.status}">
    ${exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
</span>
            </td>
        </tr>
    `).join("");
        }

        const activityTableBody = document.getElementById("activityTableBody");

if (data.recentActivity.length === 0) {
    activityTableBody.innerHTML = `
        <tr>
            <td colspan="5">No student activity found.</td>
        </tr>
    `;
} else {
    activityTableBody.innerHTML = data.recentActivity.map(activity => `
        <tr>
            <td>${activity.student_id}</td>
            <td>${activity.student_name}</td>
            <td>${activity.exam_title}</td>
            <td>
                ${activity.obtained_marks !== null
                    ? `${activity.obtained_marks}/${activity.total_marks}`
                    : "Not evaluated"}
            </td>
            <td>
                <span class="statusBadge ${activity.status}">
                    ${activity.status
                        ? activity.status.charAt(0).toUpperCase() + activity.status.slice(1)
                        : "Unknown"}
                </span>
            </td>
        </tr>
    `).join("");
}
    } catch (error) {
        console.error("Dashboard loading error:", error);
        adminName.textContent = "Unable to load";
    }
});