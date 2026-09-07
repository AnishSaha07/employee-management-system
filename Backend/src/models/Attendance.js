const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
    {
        employee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
            required: true,
        },

        employeeId: {
            type: String,
            required: true,
            index: true,
        },

        date: {
            type: String,
            required: true,
        },

        checkIn: {
            type: Date,
            default: null,
        },

        checkOut: {
            type: Date,
            default: null,
        },

        workingMinutes: {
            type: Number,
            default: 0,
        },

        status: {
            type: String,
            enum: ["Present", "Absent", "Late"],
            required: true,
        },

        // Employee's GPS position during check-in
        checkInLocation: {
            latitude: {
                type: Number,
                default: null,
            },

            longitude: {
                type: Number,
                default: null,
            },

            distanceFromOffice: {
                type: Number,
                default: null,
            },
        },

        // Employee's GPS position during check-out
        checkOutLocation: {
            latitude: {
                type: Number,
                default: null,
            },

            longitude: {
                type: Number,
                default: null,
            },

            distanceFromOffice: {
                type: Number,
                default: null,
            },
        },
    },
    {
        timestamps: true,
    }
);

// One attendance record per employee per day
attendanceSchema.index(
    { employeeId: 1, date: 1 },
    { unique: true }
);

module.exports = mongoose.model(
    "Attendance",
    attendanceSchema
);