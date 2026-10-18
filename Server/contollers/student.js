const db = require('../config/db');

const displayDashboard=async(req,res)=>{
    try {
        const sid=req.session.student.student_id;
        
        const [students]= await db.query(`select student_id,username,email,contact,address from students where student_id=? limit 1`,[sid]);

        if(students.length===0){
            return res.status(404).json({
                success:false,
                msg:"Student Profile not found."
            });
        }

        return res.status(200).json({
            success:true,
            msg:"Student dashboard data retrieved successfully.",
            student:students[0]
        });
    } catch (error) {
        console.error("Dashboard error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to load student dashboard."
        });
    }
}

module.exports={displayDashboard};