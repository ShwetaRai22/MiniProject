const express=require("express");
const router=express.Router();
const {loginStudent, registerStudent,loginAdmin,registerAdmin}=require('../controllers/auth');

router.post('/student/signin',loginStudent);
router.post('/student/signup',registerStudent);
router.post('/admin/signin',loginAdmin);
router.post('/admin/signup',registerAdmin);
module.exports=router;