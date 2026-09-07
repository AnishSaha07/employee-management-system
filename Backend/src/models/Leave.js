const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema(
    {
        // ==========================================
        // EMPLOYEE INFORMATION
        // ==========================================

        employee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
            required: true,
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

        // ==========================================
        // LEAVE DETAILS
        // ==========================================

        leaveType: {
            type: String,
            required: true,
            trim: true,
        },

        fromDate: {
            type: Date,
            required: true,
        },

        toDate: {
            type: Date,
            required: true,
        },

        reason: {
            type: String,
            required: true,
            trim: true,
        },

        // ==========================================
        // LEAVE STATUS
        // ==========================================

        status: {
            type: String,
            enum: [
                "Pending",
                "Approved",
                "Rejected",
            ],
            default: "Pending",
            index: true,
        },

        // ==========================================
        // APPROVAL DETAILS
        // ==========================================

        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
            default: null,
        },

        approvedAt: {
            type: Date,
            default: null,
        },

        // ==========================================
        // REJECTION DETAILS
        // ==========================================

        rejectedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
            default: null,
        },

        rejectedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// ==========================================
// DATE VALIDATION
// ==========================================

leaveSchema.pre("validate", async function () {

    if (
        this.fromDate &&
        this.toDate &&
        this.fromDate > this.toDate
    ) {
        throw new Error(
            "Leave start date cannot be after end date."
        );
    }

});

module.exports = mongoose.model(
    "Leave",
    leaveSchema
);