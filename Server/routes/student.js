const express= require("express");

const router=express.Router();

const {checkauth}=require('../middleware/authMiddleware');
const {displayDashboard,displayProfile}=require('../contollers/student');

router.get('/dashboard',checkauth,displayDashboard);
router.get('/profile',displayProfile);
module.exports=router;