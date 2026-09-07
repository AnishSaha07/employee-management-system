const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
        /* ==========================================
                    EMPLOYEE INFORMATION
        ========================================== */

        employee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
            required: true,
            index: true,
        },

        employeeId: {
            type: String,
            required: true,
            trim: true,
            uppercase: true,
            index: true,
        },

        employeeName: {
            type: String,
            required: true,
            trim: true,
        },


        /* ==========================================
                        TASK DETAILS
        ========================================== */

        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        priority: {
            type: String,
            enum: [
                "Low",
                "Medium",
                "High",
            ],
            default: "Medium",
            required: true,
        },

        dueDate: {
            type: Date,
            required: true,
        },


        /* ==========================================
                        TASK STATUS
        ========================================== */

        status: {
            type: String,
            enum: [
                "Pending",
                "In Progress",
                "Completed",
            ],
            default: "Pending",
            index: true,
        },


        /* ==========================================
                    ASSIGNMENT INFORMATION
        ========================================== */

        assignedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
            required: true,
        },
    },

    {
        timestamps: true,
    }
);


module.exports = mongoose.model(
    "Task",
    taskSchema
);