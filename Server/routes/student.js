const express= require("express");

const router=express.Router();

const {checkStudentAuth}=require('../middleware/authMiddleware');
const {displayDashboard,displayProfile, updateProfile, studentLogout}=require('../controllers/student');

router.get('/dashboard',checkStudentAuth,displayDashboard);
router.get('/profile',checkStudentAuth,displayProfile);
router.put('/profile',checkStudentAuth,updateProfile);
router.post('/logout',studentLogout);
module.exports=router;