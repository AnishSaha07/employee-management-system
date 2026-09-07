const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
    {
        employeeId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            uppercase: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false,
        },

        role: {
            type: String,
            enum: ["admin", "employee"],
            default: "employee",
        },

        /* =========================
                JOB DETAILS
        ========================= */

        department: {
            type: String,
            default: "",
            trim: true,
        },

        designation: {
            type: String,
            default: "",
            trim: true,
        },

        joiningDate: {
            type: Date,
            default: null,
        },

        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active",
        },

        /* =========================
              PERSONAL DETAILS
        ========================= */

        phone: {
            type: String,
            default: "",
        },

        dateOfBirth: {
            type: Date,
            default: null,
        },

        gender: {
            type: String,
            default: "",
        },

        address: {
            type: String,
            default: "",
        },

        city: {
            type: String,
            default: "",
        },

        state: {
            type: String,
            default: "",
        },

        pincode: {
            type: String,
            default: "",
        },

        profileImage: {
            type: String,
            default: "",
        },

        /* =========================
              SALARY DETAILS
        ========================= */

        basicSalary: {
            type: Number,
            default: 0,
            min: 0,
        },

        allowances: {
            hra: {
                type: Number,
                default: 0,
            },

            medical: {
                type: Number,
                default: 0,
            },

            travel: {
                type: Number,
                default: 0,
            },

            special: {
                type: Number,
                default: 0,
            },
        },

        deductions: {
            pf: {
                type: Number,
                default: 0,
            },

            tax: {
                type: Number,
                default: 0,
            },

            other: {
                type: Number,
                default: 0,
            },
        },

        /* =========================
                BANK DETAILS
        ========================= */

        bankDetails: {
            bankName: {
                type: String,
                default: "",
            },

            accountHolderName: {
                type: String,
                default: "",
            },

            accountNumber: {
                type: String,
                default: "",
            },

            ifscCode: {
                type: String,
                default: "",
            },

            branchName: {
                type: String,
                default: "",
            },
        },

        /* =========================
              EMERGENCY CONTACT
        ========================= */

        emergencyContact: {
            name: {
                type: String,
                default: "",
            },

            relationship: {
                type: String,
                default: "",
            },

            phone: {
                type: String,
                default: "",
            },
        },

        /* =========================
              PAYROLL HISTORY
        ========================= */

        payrollHistory: {
            type: [mongoose.Schema.Types.Mixed],
            default: [],
        },
    },

    {
        timestamps: true,
    }
);


module.exports =
    mongoose.model(
        "Employee",
        employeeSchema
    );