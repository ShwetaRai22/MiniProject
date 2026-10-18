const express= require("express");

const router=express.Router();

const {checkauth}=require('../middleware/authMiddleware');
const {displayDashboard}=require('../contollers/student');

router.get('/dashboard',checkauth,displayDashboard);

module.exports=router;