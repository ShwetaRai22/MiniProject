const express= require("express");
const router=express.Router();

const {checkStudentAuth}=require('../middleware/authMiddleware');
const {displayDashboard,displayProfile, updateProfile, studentLogout, displayAvailableExams,displayExamInstructions,displayExamQuestions,startExam,submitExam}=require('../controllers/student');
router.get('/dashboard',checkStudentAuth,displayDashboard);
router.get('/profile',checkStudentAuth,displayProfile);
router.put('/profile',checkStudentAuth,updateProfile);
router.post('/logout',studentLogout);
router.get('/availableExams',checkStudentAuth,displayAvailableExams);
router.get('/examInstructions',checkStudentAuth,displayExamInstructions);
router.get('/examQuestions',checkStudentAuth,displayExamQuestions);
router.post('/startExam',checkStudentAuth,startExam);
router.post('/submitExam',checkStudentAuth,submitExam);
module.exports=router;