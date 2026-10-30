const express=require("express");
const router=express.Router();
const {loginStudent, registerStudent}=require('../controllers/Studentauth');

router.post('/student/signin',loginStudent);
router.post('/student/signup',registerStudent);

module.exports=router;