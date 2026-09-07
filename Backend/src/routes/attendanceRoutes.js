const express = require("express");

const {
    checkIn,
    checkOut,
    getMyAttendance,
    getAllAttendance,
    getTodayAttendance,
} = require("../controllers/attendanceController");

const {
    protect,
    authorize,
} = require("../middleware/authMiddleware");


const router = express.Router();


/* ==========================================
        EMPLOYEE ATTENDANCE
========================================== */

router.post(
    "/check-in",
    protect,
    checkIn
);


router.post(
    "/check-out",
    protect,
    checkOut
);


router.get(
    "/my",
    protect,
    getMyAttendance
);


/* ==========================================
        ADMIN ATTENDANCE
========================================== */

router.get(
    "/",
    protect,
    authorize("admin"),
    getAllAttendance
);


router.get(
    "/today",
    protect,
    authorize("admin"),
    getTodayAttendance
);


module.exports = router;