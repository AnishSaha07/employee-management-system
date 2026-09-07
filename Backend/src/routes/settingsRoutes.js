const express = require("express");

const {
    getAttendanceSettings,
    updateAttendanceSettings,
} = require("../controllers/settingsController");

const {
    protect,
    authorize,
} = require("../middleware/authMiddleware");


const router = express.Router();


/* ==========================================
        GET ATTENDANCE LOCATION
        ADMIN ONLY
========================================== */

router.get(
    "/attendance",
    protect,
    authorize("admin"),
    getAttendanceSettings
);


/* ==========================================
        UPDATE ATTENDANCE LOCATION
        ADMIN ONLY
========================================== */

router.put(
    "/attendance",
    protect,
    authorize("admin"),
    updateAttendanceSettings
);


module.exports = router;