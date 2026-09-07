const express = require("express");

const {
    createTask,
    getAllTasks,
    getMyTasks,
    getTaskById,
    updateTask,
    deleteTask,
    updateTaskStatus,
} = require("../controllers/taskController");

const {
    protect,
    authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();


/* ==========================================
                ADMIN ROUTES
========================================== */


/**
 * CREATE / ASSIGN TASK
 * POST /api/tasks
 *
 * Admin only
 */
router.post(
    "/",
    protect,
    authorize("admin"),
    createTask
);


/**
 * GET ALL TASKS
 * GET /api/tasks
 *
 * Admin only
 */
router.get(
    "/",
    protect,
    authorize("admin"),
    getAllTasks
);


/**
 * UPDATE TASK
 * PUT /api/tasks/:id
 *
 * Admin only
 */
router.put(
    "/:id",
    protect,
    authorize("admin"),
    updateTask
);


/**
 * DELETE TASK
 * DELETE /api/tasks/:id
 *
 * Admin only
 */
router.delete(
    "/:id",
    protect,
    authorize("admin"),
    deleteTask
);


/* ==========================================
                EMPLOYEE ROUTES
========================================== */


/**
 * GET MY TASKS
 * GET /api/tasks/my
 *
 * Employee only
 */
router.get(
    "/my",
    protect,
    authorize("employee"),
    getMyTasks
);


/**
 * UPDATE TASK STATUS
 * PUT /api/tasks/:id/status
 *
 * Employee only
 */
router.put(
    "/:id/status",
    protect,
    authorize("employee"),
    updateTaskStatus
);


/* ==========================================
            EMPLOYEE / ADMIN
========================================== */


/**
 * GET SINGLE TASK
 * GET /api/tasks/:id
 *
 * Employee:
 *   Can only view own task.
 *
 * Admin:
 *   Can view any task.
 */
router.get(
    "/:id",
    protect,
    authorize("employee", "admin"),
    getTaskById
);


module.exports = router;