lucide.createIcons();
document.addEventListener('DOMContentLoaded',async(req,res)=>{
    const adminName = document.getElementById("adminName");
    const adminId = document.getElementById("adminId");
    try {
        const response= await fetch(
            `${API_BASE_URL}/api/admin/dashboard`,
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
        adminName.textContent=data.admin.username;
        adminId.textContent=`ADM00${data.admin.admin_id}`;
    } catch (error) {
    console.error("Dashboard loading error:", error);
    adminName.textContent = "Unable to load";
}
});