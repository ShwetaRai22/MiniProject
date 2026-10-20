const express= require("express");

const router=express.Router();

const {checkauth}=require('../middleware/authMiddleware');
const {displayDashboard,displayProfile, updateProfile, studentLogout}=require('../contollers/student');

router.get('/dashboard',checkauth,displayDashboard);
router.get('/profile',checkauth,displayProfile);
router.put('/profile',checkauth,updateProfile);
router.post('/logout',studentLogout);
module.exports=router;