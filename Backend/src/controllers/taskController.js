const Task = require("../models/Task");
const Employee = require("../models/Employee");


/* ==========================================
                CREATE TASK
                ADMIN ONLY
========================================== */

const createTask = async (req, res) => {
    try {

        const admin = req.user;

        const {
            employeeId,
            title,
            description,
            priority,
            dueDate,
        } = req.body;


        /* ==========================================
                        VALIDATION
        ========================================== */

        if (
            !employeeId ||
            !title ||
            !description ||
            !priority ||
            !dueDate
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Employee, title, description, priority and due date are required.",
            });
        }


        /* ==========================================
                    FIND ASSIGNED EMPLOYEE
        ========================================== */

        const employee =
            await Employee.findOne({
                employeeId: employeeId.trim().toUpperCase(),
                role: "employee",
            });


        if (!employee) {
            return res.status(404).json({
                success: false,
                message:
                    "Employee not found.",
            });
        }


        /* ==========================================
                    VALIDATE PRIORITY
        ========================================== */

        const allowedPriorities = [
            "Low",
            "Medium",
            "High",
        ];

        if (
            !allowedPriorities.includes(
                priority
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid task priority.",
            });
        }


        /* ==========================================
                    VALIDATE DUE DATE
        ========================================== */

        const parsedDueDate =
            new Date(dueDate);

        if (
            Number.isNaN(
                parsedDueDate.getTime()
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid task due date.",
            });
        }


        /* ==========================================
                        CREATE TASK
        ========================================== */

        const task =
            await Task.create({

                employee:
                    employee._id,

                employeeId:
                    employee.employeeId,

                employeeName:
                    employee.name,

                title:
                    title.trim(),

                description:
                    description.trim(),

                priority,

                dueDate:
                    parsedDueDate,

                status:
                    "Pending",

                assignedBy:
                    admin._id,

            });


        /* ==========================================
                    POPULATE ASSIGNER
        ========================================== */

        await task.populate(
            "assignedBy",
            "name employeeId role"
        );


        return res.status(201).json({

            success: true,

            message:
                "Task assigned successfully.",

            task,

        });

    } catch (error) {

        console.error(
            "Create task error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error while creating task.",
        });
    }
};


/* ==========================================
                GET ALL TASKS
                ADMIN ONLY
========================================== */

const getAllTasks = async (req, res) => {
    try {

        const tasks =
            await Task.find()
                .populate(
                    "assignedBy",
                    "name employeeId role"
                )
                .sort({
                    createdAt: -1,
                });


        return res.status(200).json({

            success: true,

            count:
                tasks.length,

            tasks,

        });

    } catch (error) {

        console.error(
            "Get all tasks error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to fetch tasks.",
        });
    }
};


/* ==========================================
                GET MY TASKS
                EMPLOYEE ONLY
========================================== */

const getMyTasks = async (req, res) => {
    try {

        const employee =
            req.user;


        const tasks =
            await Task.find({
                employee:
                    employee._id,
            })
                .populate(
                    "assignedBy",
                    "name employeeId role"
                )
                .sort({
                    createdAt: -1,
                });


        return res.status(200).json({

            success: true,

            count:
                tasks.length,

            tasks,

        });

    } catch (error) {

        console.error(
            "Get my tasks error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to fetch your tasks.",
        });
    }
};


/* ==========================================
                GET TASK BY ID
            EMPLOYEE / ADMIN
========================================== */

const getTaskById = async (req, res) => {
    try {

        const task =
            await Task.findById(
                req.params.id
            )
                .populate(
                    "assignedBy",
                    "name employeeId role"
                );


        if (!task) {
            return res.status(404).json({
                success: false,
                message:
                    "Task not found.",
            });
        }


        /* ==========================================
                    EMPLOYEE OWNERSHIP
        ========================================== */

        if (
            req.user.role !== "admin" &&
            task.employee.toString() !==
                req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "You do not have permission to view this task.",
            });
        }


        return res.status(200).json({

            success: true,

            task,

        });

    } catch (error) {

        console.error(
            "Get task error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to fetch task.",
        });
    }
};


/* ==========================================
                UPDATE TASK
                ADMIN ONLY
========================================== */

const updateTask = async (req, res) => {
    try {

        const task =
            await Task.findById(
                req.params.id
            );


        if (!task) {
            return res.status(404).json({
                success: false,
                message:
                    "Task not found.",
            });
        }


        const {
            employeeId,
            title,
            description,
            priority,
            dueDate,
        } = req.body;


        /* ==========================================
                    EMPLOYEE UPDATE
        ========================================== */

        if (employeeId) {

            const employee =
                await Employee.findOne({
                    employeeId:
                        employeeId
                            .trim()
                            .toUpperCase(),

                    role: "employee",
                });


            if (!employee) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Employee not found.",
                });
            }


            task.employee =
                employee._id;

            task.employeeId =
                employee.employeeId;

            task.employeeName =
                employee.name;
        }


        /* ==========================================
                    OTHER FIELDS
        ========================================== */

        if (title !== undefined) {
            task.title =
                title.trim();
        }

        if (
            description !== undefined
        ) {
            task.description =
                description.trim();
        }


        if (priority !== undefined) {

            const allowedPriorities = [
                "Low",
                "Medium",
                "High",
            ];

            if (
                !allowedPriorities.includes(
                    priority
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid task priority.",
                });
            }

            task.priority =
                priority;
        }


        if (dueDate !== undefined) {

            const parsedDueDate =
                new Date(dueDate);

            if (
                Number.isNaN(
                    parsedDueDate.getTime()
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid task due date.",
                });
            }

            task.dueDate =
                parsedDueDate;
        }


        await task.save();


        await task.populate(
            "assignedBy",
            "name employeeId role"
        );


        return res.status(200).json({

            success: true,

            message:
                "Task updated successfully.",

            task,

        });

    } catch (error) {

        console.error(
            "Update task error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to update task.",
        });
    }
};


/* ==========================================
                DELETE TASK
                ADMIN ONLY
========================================== */

const deleteTask = async (req, res) => {
    try {

        const task =
            await Task.findById(
                req.params.id
            );


        if (!task) {
            return res.status(404).json({
                success: false,
                message:
                    "Task not found.",
            });
        }


        await task.deleteOne();


        return res.status(200).json({

            success: true,

            message:
                "Task deleted successfully.",

        });

    } catch (error) {

        console.error(
            "Delete task error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to delete task.",
        });
    }
};


/* ==========================================
            UPDATE TASK STATUS
                EMPLOYEE ONLY
========================================== */

const updateTaskStatus = async (req, res) => {
    try {

        const employee =
            req.user;

        const task =
            await Task.findById(
                req.params.id
            );


        if (!task) {
            return res.status(404).json({
                success: false,
                message:
                    "Task not found.",
            });
        }


        /* ==========================================
                    OWNERSHIP CHECK
        ========================================== */

        if (
            task.employee.toString() !==
            employee._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "You can only update your own tasks.",
            });
        }


        const { status } =
            req.body;


        const allowedStatuses = [
            "Pending",
            "In Progress",
            "Completed",
        ];


        if (
            !allowedStatuses.includes(
                status
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid task status.",
            });
        }


        /* ==========================================
                STATUS TRANSITION RULES
        ========================================== */

        if (
            task.status === "Pending" &&
            ![
                "Pending",
                "In Progress",
            ].includes(status)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Pending task can only remain Pending or move to In Progress.",
            });
        }


        if (
            task.status === "In Progress" &&
            ![
                "In Progress",
                "Completed",
            ].includes(status)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "In Progress task can only remain In Progress or move to Completed.",
            });
        }


        if (
            task.status === "Completed" &&
            status !== "Completed"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Completed task cannot be changed.",
            });
        }


        task.status =
            status;


        await task.save();


        await task.populate(
            "assignedBy",
            "name employeeId role"
        );


        return res.status(200).json({

            success: true,

            message:
                "Task status updated successfully.",

            task,

        });

    } catch (error) {

        console.error(
            "Update task status error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to update task status.",
        });
    }
};


/* ==========================================
                    EXPORTS
========================================== */

module.exports = {

    createTask,

    getAllTasks,

    getMyTasks,

    getTaskById,

    updateTask,

    deleteTask,

    updateTaskStatus,

};