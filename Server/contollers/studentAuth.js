const db=require('../config/db');
const bcrypt=require("bcrypt");

const loginStudent= async (req,res)=>{
    try {
        const {username,password}=req.body;
        if(!username?.trim()||!password){
            return res.status(400).json({
                success:false,
                msg:"Please enter your username and password."
            });
        }

        const [students]=await db.query(`
            SELECT student_id,username,email,password from students where username=? limit 1`,[username.trim()]);

            if(students.length===0){
                return res.status(401).json({
                    success:false,
                    msg:"Student not found! Invalid username or password."
                });
            }
            const student=students[0];
            const matchPassword= await bcrypt.compare(password,student.password);
       
        if(!matchPassword){
            return res.status(401).json({
                success:false,
                msg:"Inalid username or password"
            });
        }
        // stores student info on server-side
        req.session.student={
            student_id:student.student_id,
            username:student.username,
            email:student.email
        };
        // console.log("Session ID:", req.sessionID);
        // console.log("Session data:", req.session);

        return res.status(200).json({
            success:true,
            msg:"Login successful",
            student:{
                student_id: student.student_id,
                username: student.username,
                email: student.email
            }
        })
    }
     catch (error) {
        console.error("Student login error:",error.message);

        return res.status(500).json({
            success:false,
            msg:"an internal server error occured"
        });
    }
}

const registerStudent = async (req, res) => {
    try {
        const {
            username,
            email,
            contact,
            address,
            password,
            confirmPassword
        } = req.body;
        //sb field filled h n?
        if (
            !username?.trim() ||
            !email?.trim() ||
            !contact?.trim() ||
            !address?.trim() ||
            !password ||
            !confirmPassword
        ) {
            return res.status(400).json({
                success: false,
                msg: "Please fill all the required fields."
            });
        }
        //password and confirm password match kr rhe h n?
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                msg: "Password do not match."
            });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address."
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                msg: "Password must be atleast 8 characters."
            });
        }

        if (!/^[0-9]{10}$/.test(contact.trim())) {
        return res.status(400).json({
        success: false,
        message: "Contact number must contain exactly 10 digits."
            });
        }

        const [present] = await db.query(
            `select student_id from students where username=? OR email=? limit 1`, [username.trim(), email.trim()]
        );
        if (present.length > 0) {
            return res.status(409).json({
                success: false,
                msg: "Username or email is already registered."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [students] = await db.query(
            `insert into students(username,email,contact,address,password) values(?,?,?,?,?)`, [username.trim(), email.trim(), contact.trim(), address.trim(), hashedPassword.trim()]
        );

        return res.status(201).json({
            success: true,
            msg: "! Registration Successful !",
            studentRecord: {
                student_id: students.insertId,
                username: username.trim(),
                email: email.trim()
            }
        });
    }
    catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message: "Username or email is already registered."
            });
        }

        console.error("registration error:",error.message);

         return res.status(500).json({
            success: false,
            message: "An internal server error occurred."
        });
    }
}

module.exports={loginStudent,registerStudent};