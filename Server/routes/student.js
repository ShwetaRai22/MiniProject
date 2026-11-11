const express= require("express");
const db=require('../config/db');
const router=express.Router();

const {checkStudentAuth}=require('../middleware/authMiddleware');
const {displayDashboard,displayProfile, updateProfile, studentLogout, displayAvailableExams}=require('../controllers/student');
router.get('/testTime', async (req, res) => {
    const [rows] = await db.query(
        "SELECT @@session.time_zone AS timezone, NOW() AS currentTime, UTC_TIMESTAMP() AS utcTime"
    );

    res.json(rows[0]);
});
router.get('/dashboard',checkStudentAuth,displayDashboard);
router.get('/profile',checkStudentAuth,displayProfile);
router.put('/profile',checkStudentAuth,updateProfile);
router.post('/logout',studentLogout);
router.get('/availableExams',checkStudentAuth,displayAvailableExams);
module.exports=router;