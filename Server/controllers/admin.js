const db = require('../config/db');

const displayDashboard=async(req,res)=>{
    try {
        const adminId=req.session.admin.admin_id;

        const [admins]= await db.query(`select admin_id,username,email,contact,address from admins where admin_id=? limit 1`,[adminId]);

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
        const adminId=req.session.admin.admin_id;

        const [admins]= await db.query(`select admin_id,username,email,contact,address from admins where admin_id=? limit 1`,[adminId]);
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
        const adminId = req.session.admin.admin_id;

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
            [cleanUsername, cleanEmail, adminId]
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
            [cleanUsername, cleanEmail, cleanContact, cleanAddress, adminId]
        );

        if (result.affectedRows === 0) {
            const [admins] = await db.query(
                `SELECT admin_id FROM admins WHERE admin_id = ?`,
                [adminId]
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
                admin_id: adminId,
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

const createExam = async (req, res) => {
    try {
        adminId=req.session.admin.admin_id;
        const {  title,
            subject,
            examDate,
            duration,
            startTime,
            endTime,
            totalMarks,
            passingMarks } = req.body;

             if (
            typeof title !== "string" || !title.trim() ||
            typeof subject !== "string" || !subject.trim() ||
            !examDate ||
            !startTime ||
            !endTime ||
            duration === undefined ||
            totalMarks === undefined ||
            passingMarks === undefined
        ){
            return res.status(400).json({
                success: false,
                msg: "Please fill in all required fields."
            });
        }

        const cleanTitle = title.trim();
        const cleanSubject = subject.trim();

         const examDuration = Number(duration);
        const marks = Number(totalMarks);
        const passMarks = Number(passingMarks);

        if (
            !Number.isInteger(examDuration) || examDuration <= 0 ||
            !Number.isInteger(marks) || marks <= 0 ||
            !Number.isInteger(passMarks) ||
            passMarks < 0 || passMarks > marks
        ) {
            return res.status(400).json({
                success: false,
                msg: "Please enter valid values for exam duration and marks."
            });
        }

        const startDateTime = `${examDate} ${startTime}:00`;
        const endDateTime = `${examDate} ${endTime}:00`;

        if(endDateTime <= startDateTime){
            return res.status(400).json({
                success: false,
                msg: "End time must be after start time."
            });
        }

        const [existingSubjects] = await db.query(
            `SELECT subject_id
             FROM subjects
             WHERE LOWER(TRIM(name)) = LOWER(?)
             LIMIT 1`,
            [cleanSubject]
        );

        let subjectId;
        if (existingSubjects.length > 0) {
            subjectId = existingSubjects[0].subject_id;
        } else {
                    const [subjectResult] = await db.query(
                `INSERT INTO subjects (name)
                 VALUES (?)`,
                [cleanSubject]
            );
            subjectId = subjectResult.insertId;
        }

        const [examResult] = await db.query(
            `INSERT INTO exams (admin_id, subject_id, title, start_time, end_time, duration, total_marks, passing_marks)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [ adminId,
                subjectId,
                cleanTitle,
                startDateTime,
                endDateTime,
                examDuration,
                marks,
                passMarks]
        );
         return res.status(201).json({
            success: true,
            msg: "Exam created successfully.",
            exam_id: examResult.insertId
        });
        }

    catch (error) {
        console.error("Create exam error:", error);
        return res.status(500).json({
            success: false,
            msg: "Unable to create exam."
        });
    }
}

const addQuestion = async (req, res) => {
    try {
        const adminId = req.session.admin.admin_id;
        const { examId, questions } = req.body;

        const selectedExamId = Number(examId);

        if (
            !Number.isInteger(selectedExamId) ||
            selectedExamId <= 0 ||
            !Array.isArray(questions) ||
            questions.length === 0
        ) {
            return res.status(400).json({
                success: false,
                msg: "Please select an exam and add at least one question."
            });
        }

          const validLetters = ["A", "B", "C", "D"];

        for (const question of questions) {
            if (
                typeof question.question !== "string" ||
                !question.question.trim() ||
                !question.options ||
                !Number.isInteger(Number(question.marks)) ||
                Number(question.marks) <= 0 ||
                !validLetters.includes(question.correctAnswer)
            ) {
                return res.status(400).json({
                    success: false,
                    msg: "Invalid question details."
                });
            }
        
        for (const letter of validLetters) {
                if (
                    typeof question.options[letter] !== "string" ||
                    !question.options[letter].trim()
                ) {
                    return res.status(400).json({
                        success: false,
                        msg: "All four options are required."
                    });
                }
            }
        }
        
        const [exams]= await db.query(`SELECT exam_id FROM exams WHERE exam_id=? AND admin_id=? LIMIT 1`,[selectedExamId,adminId]);

        if(exams.length===0){
            return res.status(404).json({
                success:false,
                msg:"Exam not found or you do not have permission to add questions to this exam."
            });
        }

        for (const question of questions) {
            const[questionResult] = await db.query(
                `INSERT INTO questions (exam_id, question_text, type,marks)
                 VALUES (?, ?, ?, ?)`,
                [selectedExamId, question.question.trim(), "MCQ", Number(question.marks)]
            );  
            const questionId = questionResult.insertId;

            for (const letter of validLetters) {

                await db.query(
                    `INSERT INTO options
                     (question_id, option_text, is_correct)
                     VALUES (?, ?, ?)`,
                    [
                        questionId,
                        question.options[letter].trim(),
                        question.correctAnswer === letter ? 1 : 0
                    ]
                );
            }
        }

        return res.status(201).json({
            success: true,
            msg: "Questions added successfully."
        });
    } catch (error) {
        console.error("Add question error:", error);
        return res.status(500).json({
            success: false,
            msg: "Unable to add question."
        });
    }
}

const getAdminExams = async (req, res) => {
    try {
        const adminId = req.session.admin.admin_id;

        const [exams] = await db.query(
            `SELECT e.exam_id, e.title, s.name AS subject
             FROM exams e
             JOIN subjects s ON e.subject_id = s.subject_id
             WHERE e.admin_id = ?
             ORDER BY e.created_at DESC`,
            [adminId]
        );

        return res.status(200).json({
            success: true,
            exams: exams
        });

    } catch (error) {
        console.error("Fetch exams error:", error);

        return res.status(500).json({
            success: false,
            msg: "Unable to fetch exams."
        });
    }
};
const displayAdminExams = async (req, res) => {
    try {
        const adminId = req.session.admin.admin_id;

        const [exams] = await db.query(
            `SELECT
                e.exam_id,
                e.title,
                s.name AS subject,
                DATE_FORMAT(e.start_time, '%Y-%m-%d') AS exam_date,
                e.end_time,
                e.duration,
                e.total_marks,
                e.passing_marks,
                e.status,
                COUNT(q.question_id) AS total_questions
            FROM exams e
            JOIN subjects s
                ON e.subject_id = s.subject_id
            LEFT JOIN questions q
                ON e.exam_id = q.exam_id
            WHERE e.admin_id = ?
            GROUP BY e.exam_id
            ORDER BY e.created_at DESC`,
            [adminId]
        );

        return res.status(200).json({
            success: true,
            exams: exams
        });

    } catch (error) {
        console.error("Fetch admin exams error:", error);

        return res.status(500).json({
            success: false,
            msg: "Unable to fetch examinations."
        });
    }
}


const updateExamStatus = async (req, res) => {
    try {
        const adminId = req.session.admin.admin_id;
        const { examId, status } = req.body;

        const allowedStatuses = [
            "draft",
            "scheduled",
            "live",
            "in-progress",
            "completed"
        ];

        if (!examId || !allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                msg: "Invalid exam ID or status."
            });
        }

        const [result] = await db.query(
            `UPDATE exams
             SET status = ?
             WHERE exam_id = ? AND admin_id = ?`,
            [status, examId, adminId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                msg: "Exam not found."
            });
        }

        return res.status(200).json({
            success: true,
            msg: "Exam status updated successfully."
        });

    } catch (error) {
        console.error("Update exam status error:", error);

        return res.status(500).json({
            success: false,
            msg: "Unable to update exam status."
        });
    }
}


const deleteExam = async (req, res) => {
    try {
        const adminId = req.session.admin.admin_id;
        const { examId } = req.body;

        if (!examId) {
            return res.status(400).json({
                success: false,
                msg: "Exam ID is required."
            });
        }

        const [result] = await db.query(
            `DELETE FROM exams
             WHERE exam_id = ? AND admin_id = ?`,
            [examId, adminId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                msg: "Exam not found."
            });
        }

        return res.status(200).json({
            success: true,
            msg: "Exam deleted successfully."
        });

    } catch (error) {
        console.error("Delete exam error:", error);

        return res.status(500).json({
            success: false,
            msg: "Unable to delete exam."
        });
    }
}


const getAllStudents = async (req, res) => {
    try {
        const [students] = await db.query(
            `SELECT
                student_id,
                username,
                email,
                contact,
                created_at
             FROM students
             ORDER BY created_at DESC`
        );

        return res.status(200).json({
            success: true,
            students: students
        });

    } catch (error) {
        console.error("Fetch students error:", error);

        return res.status(500).json({
            success: false,
            msg: "Unable to fetch students."
        });
    }
};

    
module.exports={displayDashboard, displayProfile,updateProfile,adminLogout,createExam,addQuestion,getAdminExams,displayAdminExams,updateExamStatus,deleteExam,getAllStudents};