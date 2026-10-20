const db = require('../config/db');

const displayDashboard=async(req,res)=>{
    try {
        const sid=req.session.student.student_id;
        
        const [students]= await db.query(`select student_id,username,email,contact,address from students where student_id=? limit 1`,[sid]);

        if(students.length===0){
            return res.status(404).json({
                success:false,
                msg:"Student dashboard data retrieved successfully."
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
            msg: "Unable to load student dashboard."
        });
    }

}

const displayProfile= async (req,res) => {
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
    success: true,
    msg: "Student profile retrieved successfully.",
    student: students[0]
});
    } catch(error){
        console.error("Profile retrival error",error);

        return res.status(500).json({
            success: false,
            msg: "Unable to load student profile.",
        });}
}


const updateProfile = async (req, res) => {
    try {
        const sid = req.session.student.student_id;

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
            `SELECT student_id
             FROM students
             WHERE (username = ? OR email = ?)
             AND student_id != ?
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
            `UPDATE students
             SET username = ?, email = ?, contact = ?, address = ?
             WHERE student_id = ?`,
            [cleanUsername, cleanEmail, cleanContact, cleanAddress, sid]
        );

        if (result.affectedRows === 0) {
            const [students] = await db.query(
                `SELECT student_id FROM students WHERE student_id = ?`,
                [sid]
            );

            if (students.length === 0) {
                return res.status(404).json({
                    success: false,
                    msg: "Student not found."
                });
            }
        }

        req.session.student.username = cleanUsername;
        req.session.student.email = cleanEmail;

        return res.status(200).json({
            success: true,
            msg: "Profile updated successfully.",
            student:{
                student_id: sid,
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
            msg: "Unable to update student profile."
        });
    }
};

module.exports={displayDashboard,displayProfile,updateProfile};