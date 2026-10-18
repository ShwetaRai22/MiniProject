const express=require("express");
const router=express.Router();
const {loginStudent}=require('../contollers/studentAuth');

router.post('/student/signin',loginStudent);
router.post('/student/signin',loginStudent);

module.exports=router;