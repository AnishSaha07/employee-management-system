const express = require("express");

const {
    generatePayroll,
    getMyPayroll,
    getAllPayroll,
    getPayrollById,
} = require("../controllers/payrollController");

const {
    protect,
    authorize,
} = require("../middleware/authMiddleware");


const router = express.Router();


/* ==========================================
                EMPLOYEE ROUTES
========================================== */


/**
 * GET MY PAYROLL
 *
 * GET /api/payroll/my
 *
 * Employee can only see
 * their own payroll records.
 */

router.get(
    "/my",
    protect,
    authorize("employee"),
    getMyPayroll
);


/**
 * GET SINGLE PAYROLL
 *
 * GET /api/payroll/:id
 *
 * Employee:
 *   Can only view their own payroll.
 *
 * Admin:
 *   Can view any payroll.
 */

router.get(
    "/:id",
    protect,
    authorize("employee", "admin"),
    getPayrollById
);


/* ==========================================
                ADMIN ROUTES
========================================== */


/**
 * GENERATE PAYROLL
 *
 * POST /api/payroll
 *
 * Admin only.
 */

router.post(
    "/",
    protect,
    authorize("admin"),
    generatePayroll
);


/**
 * GET ALL PAYROLL
 *
 * GET /api/payroll
 *
 * Admin only.
 */

router.get(
    "/",
    protect,
    authorize("admin"),
    getAllPayroll
);


module.exports = router;