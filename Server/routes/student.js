const express= require("express");

const router=express.Router();

const {checkauth}=require('../middleware/authMiddleware');
const {displayDashboard,displayProfile, updateProfile}=require('../contollers/student');

router.get('/dashboard',checkauth,displayDashboard);
router.get('/profile',checkauth,displayProfile);
router.put('/profile',checkauth,updateProfile);
module.exports=router;