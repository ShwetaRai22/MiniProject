const express= require("express");

const router=express.Router();

const {checkAdminAuth}=require('../middleware/authMiddleware');
const {displayDashboard,displayProfile, updateProfile,adminLogout}=require('../controllers/admin');

router.get('/dashboard',checkAdminAuth,displayDashboard);
router.get('/profile',checkAdminAuth,displayProfile);
router.put('/profile',checkAdminAuth,updateProfile);
router.post('/logout',adminLogout);
module.exports=router;