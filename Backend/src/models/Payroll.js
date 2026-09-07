const mongoose = require("mongoose");

const payrollSchema = new mongoose.Schema(
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
                    PAYROLL PERIOD
        ========================================== */

        month: {
            type: String,
            required: true,
            trim: true,
            match: /^\d{4}-(0[1-9]|1[0-2])$/,
        },


        /* ==========================================
                    BASIC SALARY
        ========================================== */

        basic: {
            type: Number,
            required: true,
            min: 0,
        },


        /* ==========================================
                    ALLOWANCES
        ========================================== */

        allowances: {
            hra: {
                type: Number,
                default: 0,
                min: 0,
            },

            medical: {
                type: Number,
                default: 0,
                min: 0,
            },

            travel: {
                type: Number,
                default: 0,
                min: 0,
            },

            special: {
                type: Number,
                default: 0,
                min: 0,
            },

            bonus: {
                type: Number,
                default: 0,
                min: 0,
            },
        },

        totalAllowances: {
            type: Number,
            default: 0,
            min: 0,
        },


        /* ==========================================
                    DEDUCTIONS
        ========================================== */

        deductions: {
            pf: {
                type: Number,
                default: 0,
                min: 0,
            },

            tax: {
                type: Number,
                default: 0,
                min: 0,
            },

            other: {
                type: Number,
                default: 0,
                min: 0,
            },
        },

        totalDeductions: {
            type: Number,
            default: 0,
            min: 0,
        },


        /* ==========================================
                    SALARY CALCULATION
        ========================================== */

        grossSalary: {
            type: Number,
            required: true,
            min: 0,
        },

        netSalary: {
            type: Number,
            required: true,
            min: 0,
        },


        /* ==========================================
                    PAYMENT STATUS
        ========================================== */

        status: {
            type: String,
            enum: [
                "Pending",
                "Paid",
            ],
            default: "Paid",
            index: true,
        },

        paidOn: {
            type: Date,
            default: null,
        },

        generatedAt: {
            type: Date,
            default: Date.now,
        },
    },

    {
        timestamps: true,
    }
);


/* ==========================================
        PREVENT DUPLICATE PAYROLL
        SAME EMPLOYEE + SAME MONTH
========================================== */

payrollSchema.index(
    {
        employee: 1,
        month: 1,
    },
    {
        unique: true,
    }
);


/* ==========================================
                EXPORT
========================================== */

module.exports = mongoose.model(
    "Payroll",
    payrollSchema
);