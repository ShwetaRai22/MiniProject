const db = require('../config/db');

const displayDashboard=async(req,res)=>{
    try {
        const sid=req.session.student.student_id;

        const [students]= await db.query(`select student_id,username,email,contact,address from students where student_id=? limit 1`,[sid]);

        if(students.length===0){
            return res.status(404).json({
                success:false,
                msg:"Student not found."
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
const studentLogout=(req,res) => {
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

const displayAvailableExams = async (req, res) => {
    try {
        const sid = req.session.student.student_id;

        const [exams] = await db.query(
            `SELECT
                e.exam_id,
                e.title,
                s.name AS subject,
                DATE_FORMAT(e.start_time, '%Y-%m-%d') AS exam_date,
                DATE_FORMAT(e.start_time, '%h:%i %p') AS exam_time,
                e.duration,
                e.total_marks,

                CASE
                    WHEN EXISTS (
                        SELECT 1
                        FROM exam_attempts ea
                        JOIN results r
                            ON ea.attempt_id = r.attempt_id
                        WHERE ea.exam_id = e.exam_id
                        AND ea.student_id = ?
                    ) THEN 'completed'

                    WHEN NOW() BETWEEN e.start_time AND e.end_time
                        THEN 'live'

                    ELSE 'upcoming'
                END AS status

            FROM exams e
            JOIN subjects s
                ON e.subject_id = s.subject_id

            WHERE e.status IS NOT NULL
            AND e.status != 'draft'

            AND (
                NOW() <= e.end_time
                OR EXISTS (
                    SELECT 1
                    FROM exam_attempts ea
                    JOIN results r
                        ON ea.attempt_id = r.attempt_id
                    WHERE ea.exam_id = e.exam_id
                    AND ea.student_id = ?
                )
            )

            ORDER BY e.start_time ASC`,
            [sid, sid]
        );

        return res.status(200).json({
            success: true,
            msg: "Available examinations retrieved successfully.",
            exams: exams
        });

    } catch (error) {
        console.error("Available exams error:", error);

        return res.status(500).json({
            success: false,
            msg: "Unable to retrieve available examinations."
        });
    }
};


const displayExamInstructions = async (req, res) => {
    try {
        const sid = req.session.student.student_id;
        const examId = req.query.exam_id;

        if (!examId) {
            return res.status(400).json({
                success: false,
                msg: "Exam ID is required."
            });
        }

        const [exams] = await db.query(
            `SELECT
                e.exam_id,
                e.title,
                e.duration,
                e.total_marks,
                COUNT(q.question_id) AS totalQuestions
            FROM exams e
            LEFT JOIN questions q
                ON e.exam_id = q.exam_id
            WHERE e.exam_id = ?
                AND e.status != 'draft'
                AND NOW() BETWEEN e.start_time AND e.end_time
            GROUP BY
                e.exam_id,
                e.title,
                e.duration,
                e.total_marks`,
            [examId]
        );

        if (exams.length === 0) {
            return res.status(404).json({
                success: false,
                msg: "Exam not found or is not currently live."
            });
        }

        return res.status(200).json({
            success: true,
            msg: "Exam instructions retrieved successfully.",
            exam: exams[0]
        });

    } catch (error) {
        console.error("Exam instructions error:", error);

        return res.status(500).json({
            success: false,
            msg: "Unable to retrieve exam instructions."
        });
    }
};


const displayExamQuestions = async (req, res) => {
    try {
        const examId = Number(req.query.exam_id);

        if (!Number.isInteger(examId) || examId <= 0) {
            return res.status(400).json({
                success: false,
                msg: "Valid exam ID is required."
            });
        }

        // Check whether the exam is currently live
        const [exams] = await db.query(
            `SELECT exam_id, duration
             FROM exams
             WHERE exam_id = ?
             AND status != 'draft'
             AND NOW() BETWEEN start_time AND end_time
             LIMIT 1`,
            [examId]
        );

        if (exams.length === 0) {
            return res.status(404).json({
                success: false,
                msg: "Exam not found or is not currently live."
            });
        }

        // Fetch questions and their options
        const [questions] = await db.query(
            `SELECT
                q.question_id,
                q.question_text,
                q.marks,
                o.option_id,
                o.option_text
             FROM questions q
             JOIN options o ON q.question_id = o.question_id
             WHERE q.exam_id = ?
             ORDER BY q.question_id, o.option_id`,
            [examId]
        );

        if (questions.length === 0) {
            return res.status(404).json({
                success: false,
                msg: "No questions are available for this exam."
            });
        }

        // Group options under their respective questions
        const formattedQuestions = [];

        questions.forEach(row => {
            let question = formattedQuestions.find(
                q => q.question_id === row.question_id
            );

            if (!question) {
                question = {
                    question_id: row.question_id,
                    question_text: row.question_text,
                    marks: row.marks,
                    options: []
                };

                formattedQuestions.push(question);
            }

            question.options.push({
                option_id: row.option_id,
                option_text: row.option_text
            });
        });

        return res.status(200).json({
            success: true,
            msg: "Exam questions retrieved successfully.",
            duration: exams[0].duration,
            questions: formattedQuestions
        });

    } catch (error) {
        console.error("Display exam questions error:", error);

        return res.status(500).json({
            success: false,
            msg: "Unable to retrieve exam questions."
        });
    }
};

module.exports={displayDashboard,displayProfile,updateProfile,studentLogout,displayAvailableExams,displayExamInstructions,displayExamQuestions};