const express= require("express");

const router=express.Router();

const {checkAuth}=require('../middleware/authMiddleware');
const {displayDashboard}=require('../contollers/student');

router.get('/dashboard',checkAuth,displayDashboard);

module.exports=router;