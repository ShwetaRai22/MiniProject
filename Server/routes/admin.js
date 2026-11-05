const express= require("express");

const router=express.Router();

const {checkAdminAuth}=require('../middleware/authMiddleware');
const {displayDashboard,displayProfile, updateProfile,adminLogout,createExam,addQuestion,getAdminExams,displayAdminExams,updateExamStatus,deleteExam,getAllStudents,deleteStudent}=require('../controllers/admin');

router.get('/dashboard',checkAdminAuth,displayDashboard);
router.get('/profile',checkAdminAuth,displayProfile);
router.put('/profile',checkAdminAuth,updateProfile);
router.post('/logout',adminLogout);
router.post('/createExams',checkAdminAuth,createExam);
router.post('/addQuestion',checkAdminAuth,addQuestion);
router.get('/getAdminExams', checkAdminAuth, getAdminExams);
router.get('/displayExams',checkAdminAuth,displayAdminExams);
router.put('/updateExamStatus',checkAdminAuth,updateExamStatus);
router.delete('/deleteExam',checkAdminAuth,deleteExam);
router.get('/getAllStudents',checkAdminAuth,getAllStudents);
router.put('/deleteStudent', checkAdminAuth, deleteStudent);
module.exports=router;