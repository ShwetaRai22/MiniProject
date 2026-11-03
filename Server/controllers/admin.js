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

const displayProfile= async (req,res) => {
    try {
        const sid=req.session.admin.admin_id;

        const [admins]= await db.query(`select admin_id,username,email,contact,address from admins where admin_id=? limit 1`,[sid]);
        if(admins.length===0){
            return res.status(404).json({
                success:false,
                msg:"Admin Profile not found."
            });
        }
        return res.status(200).json({
    success: true,
    msg: "Admin profile retrieved successfully.",
    admin: admins[0]
});
    } catch(error){
        console.error("Profile retrival error",error);

        return res.status(500).json({
            success: false,
            msg: "Unable to load admin profile.",
        });}
}
const updateProfile = async (req, res) => {
    try {
        const sid = req.session.admin.admin_id;

        const { username, email, contact, address } = req.body;

        if (
            typeof username !== "string" || !username.trim() ||
            typeof email !== "string" || !email.trim() ||
            typeof contact !== "string" || !contact.trim() ||
            typeof address !== "string" || !address.trim()
        ) {
            return res.status(400).json({
                success: false,
                msg: "Please fill in all required fields."
            });
        }

        const cleanUsername = username.trim();
        const cleanEmail = email.trim();
        const cleanContact = contact.trim();
        const cleanAddress = address.trim();

        const [existing] = await db.query(
            `SELECT admin_id
             FROM admins
             WHERE (username = ? OR email = ?)
             AND admin_id != ?
             LIMIT 1`,
            [cleanUsername, cleanEmail, sid]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                success: false,
                msg: "Username or email is already registered."
            });
        }

        const [result] = await db.query(
            `UPDATE admins
             SET username = ?, email = ?, contact = ?, address = ?
             WHERE admin_id = ?`,
            [cleanUsername, cleanEmail, cleanContact, cleanAddress, sid]
        );

        if (result.affectedRows === 0) {
            const [admins] = await db.query(
                `SELECT admin_id FROM admins WHERE admin_id = ?`,
                [sid]
            );

            if (admins.length === 0) {
                return res.status(404).json({
                    success: false,
                    msg: "Admin not found."
                });
            }
        }

        req.session.admin.username = cleanUsername;
        req.session.admin.email = cleanEmail;

        return res.status(200).json({
            success: true,
            msg: "Profile updated successfully.",
            admin:{
                admin_id: sid,
                username: cleanUsername,
                email: cleanEmail,
                contact: cleanContact,
                address: cleanAddress
            }
        });

    } catch (error) {
        console.error("Profile update error:", error);

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                msg: "Username or email is already registered."
            });
        }

        return res.status(500).json({
            success: false,
            msg: "Unable to update admin profile."
        });
    }
}

const adminLogout=(req,res) => {
    req.session.destroy((error)=>{
        if(error){
            console.error("Logout error:",error);

            return res.status(500).json({
                success:false,
                msg:"Unable to logout. Please try after some time."
            });
        }

        res.clearCookie("s_ID");

        return res.status(200).json({
            success:true,
            msg:"Logged out successfully."
        });
    });
}

module.exports={displayDashboard, displayProfile,updateProfile,adminLogout};