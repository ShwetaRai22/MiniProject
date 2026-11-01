const db = require('../config/db');

const displayDashboard=async(req,res)=>{
    try {
        const sid=req.session.admin.admin_id;

        const [admins]= await db.query(`select admin_id,username,email,contact,address from admins where admin_id=? limit 1`,[sid]);

        if(admins.length===0){
            return res.status(404).json({
                success:false,
                msg:"Admin not found."
            });
        }

        return res.status(200).json({
            success:true,
            msg:"Admin dashboard data retrieved successfully.",
            admin:admins[0]
        });


    } catch (error) {
        console.error("Dashboard error:", error.message);

        return res.status(500).json({
            success: false,
            msg: "Unable to load admin dashboard."
        });
    }

}

module.exports={displayDashboard}