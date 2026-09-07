const express = require("express");

const {
    applyLeave,
    getMyLeaves,
    getLeaveById,
    getAllLeaves,
    approveLeave,
    rejectLeave,
} = require("../controllers/LeaveController");

const {
    protect,
    authorize,
} = require("../middleware/authMiddleware");


const router = express.Router();


/* ==========================================
                EMPLOYEE ROUTES
========================================== */


/*
    APPLY FOR LEAVE

    POST /api/leaves
*/

router.post(
    "/",
    protect,
    authorize("employee"),
    applyLeave
);


/*
    GET MY LEAVES

    GET /api/leaves/my
*/

router.get(
    "/my",
    protect,
    authorize("employee"),
    getMyLeaves
);


/*
    GET SINGLE LEAVE

    GET /api/leaves/:id

    Employee:
        Can only view their own leave.

    Admin:
        Can view any leave.
*/

router.get(
    "/:id",
    protect,
    authorize("employee", "admin"),
    getLeaveById
);


/* ==========================================
                ADMIN ROUTES
========================================== */


/*
    GET ALL LEAVE REQUESTS

    GET /api/leaves
*/

router.get(
    "/",
    protect,
    authorize("admin"),
    getAllLeaves
);


/*
    APPROVE LEAVE

    PUT /api/leaves/:id/approve
*/

router.put(
    "/:id/approve",
    protect,
    authorize("admin"),
    approveLeave
);


/*
    REJECT LEAVE

    PUT /api/leaves/:id/reject
*/

router.put(
    "/:id/reject",
    protect,
    authorize("admin"),
    rejectLeave
);


module.exports = router;