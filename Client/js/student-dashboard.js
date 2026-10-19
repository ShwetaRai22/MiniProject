lucide.createIcons();
document.addEventListener('DOMContentLoaded',async(req,res)=>{
    const studentName = document.getElementById("studentName");
    const studentId = document.getElementById("studentId");

    try {
        const response= await fetch(
            "/api/student/dashboard",
            {
                method:"GET",
                credentials:"include"
            }
        );

        const data=await response.json();

        if(!response){
            res.status(401).json({
                success:false,
                msg:"Unable to load dashboard."
            });
            window.location.href="../auth/auth.html";
            return;
        }
        studentName.textContent=data.student.username;
        studentId.textContent=`STU00${data.student.student_id}`;

    } catch (error) {
    console.error("Dashboard loading error:", error);
    studentName.textContent = "Unable to load";
}
});

