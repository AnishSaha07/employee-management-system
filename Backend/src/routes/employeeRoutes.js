const express = require("express");

const {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    updateEmployeeSalary,
    getCurrentEmployee,
    updateMyProfile,
} = require("../controllers/employeeController");


const {
    protect,
    authorize,
} = require("../middleware/authMiddleware");


const router = express.Router();


/* =========================================
        CURRENT LOGGED-IN EMPLOYEE
========================================= */

router.get(
    "/me",
    protect,
    getCurrentEmployee
);


router.patch(
    "/me/profile",
    protect,
    updateMyProfile
);


/* =========================================
        ADMIN EMPLOYEE MANAGEMENT
========================================= */

router.get(
    "/",
    protect,
    authorize("admin"),
    getAllEmployees
);


router.post(
    "/",
    protect,
    authorize("admin"),
    createEmployee
);


router.get(
    "/:id",
    protect,
    authorize("admin"),
    getEmployeeById
);


router.put(
    "/:id",
    protect,
    authorize("admin"),
    updateEmployee
);


router.delete(
    "/:id",
    protect,
    authorize("admin"),
    deleteEmployee
);


router.patch(
    "/:id/salary",
    protect,
    authorize("admin"),
    updateEmployeeSalary
);


module.exports = router;