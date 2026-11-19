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
                (
    SELECT COUNT(*)
    FROM questions q
    WHERE q.exam_id = e.exam_id
) AS totalQuestions,
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


const startExam = async (req, res) => {
    try {
        const studentId = req.session.student.student_id;
        const examId = Number(req.body.examId);

        if (!Number.isInteger(examId) || examId <= 0) {
            return res.status(400).json({
                success: false,
                msg: "Valid exam ID is required."
            });
        }

        // Check whether this student already has an active attempt
        const [existingAttempts] = await db.query(
    `SELECT
        attempt_id,
        TIMESTAMPDIFF(SECOND, NOW(), end_time) AS remainingSeconds
     FROM exam_attempts
     WHERE student_id = ?
     AND exam_id = ?
     AND status = 'in_progress'
     AND end_time > NOW()
     ORDER BY attempt_id DESC
     LIMIT 1`,
    [studentId, examId]
);

        // Reuse the existing attempt if the student refreshes the page
        if (existingAttempts.length > 0) {
           return res.status(200).json({
    success: true,
    msg: "Existing exam attempt retrieved.",
    attemptId: existingAttempts[0].attempt_id,
    remainingSeconds: existingAttempts[0].remainingSeconds
});
        }

        // Create a new attempt only if the exam is live and has questions
        const [result] = await db.query(
    `INSERT INTO exam_attempts
        (student_id, exam_id, start_time, end_time, status)
     SELECT ?, e.exam_id, NOW(),
        DATE_ADD(NOW(), INTERVAL e.duration MINUTE),
        'in_progress'
     FROM exams e
     WHERE e.exam_id = ?
       AND e.status != 'draft'
       AND NOW() BETWEEN e.start_time AND e.end_time
       AND EXISTS (
           SELECT 1 FROM questions q WHERE q.exam_id = e.exam_id
       )`,
    [studentId, examId]
);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                msg: "Exam is not live or has no questions."
            });
        }

        const [newAttempt] = await db.query(
    `SELECT TIMESTAMPDIFF(SECOND, NOW(), end_time) AS remainingSeconds
     FROM exam_attempts
     WHERE attempt_id = ?`,
    [result.insertId]
);

return res.status(201).json({
    success: true,
    msg: "Exam attempt started successfully.",
    attemptId: result.insertId,
    remainingSeconds: newAttempt[0].remainingSeconds
});

    } catch (error) {
        console.error("Start exam error:", error);

        return res.status(500).json({
            success: false,
            msg: "Unable to start the exam."
        });
    }
};

const submitExam = async (req, res) => {
    try {
        const studentId = req.session.student.student_id;
        const { attemptId, answers } = req.body;

        // Validate submitted data
        if (!attemptId || !Array.isArray(answers)) {
            return res.status(400).json({
                success: false,
                msg: "Invalid exam submission data."
            });
        }

        // Verify that this attempt belongs to the logged-in student
        const [attempts] = await db.query(
            `SELECT attempt_id, exam_id, status
             FROM exam_attempts
             WHERE attempt_id = ?
             AND student_id = ?
             LIMIT 1`,
            [attemptId, studentId]
        );

        if (attempts.length === 0) {
            return res.status(404).json({
                success: false,
                msg: "Exam attempt not found."
            });
        }

        if (attempts[0].status !== "in_progress") {
            return res.status(400).json({
                success: false,
                msg: "This exam has already been submitted."
            });
        }

        // Fetch questions and their correct options
const [examQuestions] = await db.query(
    `SELECT
        q.question_id,
        q.marks,
        o.option_id,
        o.is_correct
     FROM questions q
     LEFT JOIN options o
        ON q.question_id = o.question_id
     WHERE q.exam_id = ?`,
    [attempts[0].exam_id]
);

if (examQuestions.length === 0) {
    return res.status(400).json({
        success: false,
        msg: "No questions found for this exam."
    });
}

// Group options under their respective questions
const questionMap = new Map();

examQuestions.forEach(row => {
    if (!questionMap.has(row.question_id)) {
        questionMap.set(row.question_id, {
            marks: row.marks,
            options: []
        });
    }

    if (row.option_id !== null) {
        questionMap.get(row.question_id).options.push({
            option_id: row.option_id,
            is_correct: row.is_correct
        });
    }
});

// Validate submitted answers
const submittedQuestionIds = new Set();

for (const answer of answers) {
    const questionId = Number(answer.questionId);

    if (
        !questionMap.has(questionId) ||
        submittedQuestionIds.has(questionId)
    ) {
        return res.status(400).json({
            success: false,
            msg: "Invalid or duplicate question in submission."
        });
    }

    submittedQuestionIds.add(questionId);

    if (answer.optionId !== null) {
        const optionId = Number(answer.optionId);

        const validOption = questionMap.get(questionId).options.some(
            option => option.option_id === optionId
        );

        if (!validOption) {
            return res.status(400).json({
                success: false,
                msg: "Invalid option selected."
            });
        }
    }
}

if (submittedQuestionIds.size !== questionMap.size) {
    return res.status(400).json({
        success: false,
        msg: "Some questions are missing from the submission."
    });
}

// Calculate marks and prepare answers for database insertion
let obtainedMarks = 0;
let correct = 0;
let incorrect = 0;
let unanswered = 0;

const answerRows = [];

for (const answer of answers) {
    const question = questionMap.get(Number(answer.questionId));

    if (answer.optionId === null) {
        unanswered++;
        continue;
    }

    const selectedOption = question.options.find(
        option => option.option_id === Number(answer.optionId)
    );

    const isCorrect = selectedOption.is_correct === 1;

    if (isCorrect) {
        correct++;
        obtainedMarks += question.marks;
    } else {
        incorrect++;
    }

    answerRows.push([
        attemptId,
        Number(answer.questionId),
        Number(answer.optionId),
        isCorrect ? 1 : 0
    ]);
}

// Calculate total marks from all exam questions
const totalMarks = Array.from(questionMap.values()).reduce(
    (total, question) => total + question.marks,
    0
);
// Get the exam's passing marks
const [examDetails] = await db.query(
    `SELECT passing_marks
     FROM exams
     WHERE exam_id = ?`,
    [attempts[0].exam_id]
);

const percentage = totalMarks > 0
    ? (obtainedMarks / totalMarks) * 100
    : 0;

const resultStatus = obtainedMarks >= examDetails[0].passing_marks
    ? "Pass"
    : "Fail";

    // Save submitted answers in the database
if (answerRows.length > 0) {
    await db.query(
        `INSERT INTO exam_answers
            (attempt_id, question_id, option_id, is_correct)
         VALUES ?`,
        [answerRows]
    );
}
   // Save the student's final result
await db.query(
    `INSERT INTO results
        (attempt_id, total_marks, obtained_marks, percentage, grade)
     VALUES (?, ?, ?, ?, ?)`,
    [
        attemptId,
        totalMarks,
        obtainedMarks,
        percentage.toFixed(2),
        resultStatus
    ]
);
// Mark the exam attempt as completed
await db.query(
    `UPDATE exam_attempts
     SET status = 'completed',
         end_time = NOW()
     WHERE attempt_id = ?
     AND student_id = ?
     AND status = 'in_progress'`,
    [attemptId, studentId]
); 

return res.status(200).json({
    success: true,
    msg: "Exam submitted successfully.",
    result: {
        totalMarks,
        obtainedMarks,
        percentage: Number(percentage.toFixed(2)),
        status: resultStatus,
        correct,
        incorrect,
        unanswered,
        totalQuestions: questionMap.size
    }
});
} catch (error) {
        console.error("Submit exam error:", error);

        return res.status(500).json({
            success: false,
            msg: "Unable to submit exam."
        });
    }
};


const displayStudentResults = async (req, res) => {
    try {
        const studentId = req.session.student.student_id;

        const [results] = await db.query(
            `SELECT
                r.result_id,
                e.title AS examName,
                s.name AS subject,
                r.total_marks AS totalMarks,
                r.obtained_marks AS obtainedMarks,
                r.percentage,
                r.grade AS status,
                DATE_FORMAT(r.created_at, '%d %M %Y') AS resultDate
             FROM results r
             JOIN exam_attempts ea
                ON r.attempt_id = ea.attempt_id
             JOIN exams e
                ON ea.exam_id = e.exam_id
             JOIN subjects s
                ON e.subject_id = s.subject_id
             WHERE ea.student_id = ?
             ORDER BY r.created_at DESC`,
            [studentId]
        );

        return res.status(200).json({
            success: true,
            msg: "Student results retrieved successfully.",
            results
        });

    } catch (error) {
        console.error("Display student results error:", error);

        return res.status(500).json({
            success: false,
            msg: "Unable to retrieve student results."
        });
    }
};

module.exports={displayDashboard,displayProfile,updateProfile,studentLogout,displayAvailableExams,displayExamInstructions,displayExamQuestions,startExam,submitExam,displayStudentResults};
