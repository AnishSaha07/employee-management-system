const Attendance = require("../models/Attendance");
const CompanySettings = require("../models/CompanySettings");

const {
    isWithinRadius,
} = require("../utils/locationUtils");


/* ==========================================
            CHECK IN
========================================== */

const checkIn = async (req, res) => {

    try {

        // Employee comes from JWT middleware
        const employee = req.user;


        /* ==========================================
                    GET LOCATION
        ========================================== */

        const {
            latitude,
            longitude,
        } = req.body;


        /* ==========================================
                VALIDATE LOCATION
        ========================================== */

        if (
            typeof latitude !== "number" ||
            typeof longitude !== "number"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Current location is required for check-in.",

            });

        }


        /* ==========================================
                GET COMPANY SETTINGS
        ========================================== */

        const settings =
            await CompanySettings.findOne();


        if (!settings) {

            return res.status(500).json({

                success: false,

                message:
                    "Office attendance location has not been configured.",

            });

        }


        const office =
            settings.officeLocation;


        /* ==========================================
                    GEOFENCE CHECK
        ========================================== */

        const locationCheck =
            isWithinRadius({

                employeeLatitude:
                    latitude,

                employeeLongitude:
                    longitude,

                officeLatitude:
                    office.latitude,

                officeLongitude:
                    office.longitude,

                radius:
                    office.radius,

            });


        if (!locationCheck.allowed) {

            return res.status(403).json({

                success: false,

                message:
                    "You are outside the allowed office attendance area.",

                distance:
                    Math.round(
                        locationCheck.distance
                    ),

            });

        }


        /* ==========================================
                    TODAY
        ========================================== */

        const today =
            new Date()
                .toISOString()
                .split("T")[0];


        /* ==========================================
                CHECK EXISTING ATTENDANCE
        ========================================== */

        const existingAttendance =
            await Attendance.findOne({

                employeeId:
                    employee.employeeId,

                date:
                    today,

            });


        if (existingAttendance) {

            return res.status(400).json({

                success: false,

                message:
                    "You have already checked in today.",

                attendance:
                    existingAttendance,

            });

        }


        /* ==========================================
                    STATUS
        ========================================== */

        const {
            status = "Present",
        } = req.body;


        if (
            !["Present", "Late"]
                .includes(status)
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid attendance status.",

            });

        }


        /* ==========================================
                CREATE ATTENDANCE
        ========================================== */

        const attendance =
            await Attendance.create({

                employee:
                    employee._id,

                employeeId:
                    employee.employeeId,

                date:
                    today,

                checkIn:
                    new Date(),

                status,

                checkInLocation: {

                    latitude,

                    longitude,

                    distanceFromOffice:
                        Math.round(
                            locationCheck.distance
                        ),

                },

            });


        /* ==========================================
                    RESPONSE
        ========================================== */

        return res.status(201).json({

            success: true,

            message:
                "Check-in successful.",

            attendance,

        });

    } catch (error) {

        console.error(
            "Check-in error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Server error during check-in.",

        });

    }

};


/* ==========================================
            CHECK OUT
========================================== */

const checkOut = async (req, res) => {

    try {

        const employee = req.user;


        /* ==========================================
                    GET LOCATION
        ========================================== */

        const {
            latitude,
            longitude,
        } = req.body;


        /* ==========================================
                VALIDATE LOCATION
        ========================================== */

        if (
            typeof latitude !== "number" ||
            typeof longitude !== "number"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Current location is required for check-out.",

            });

        }


        /* ==========================================
                GET COMPANY SETTINGS
        ========================================== */

        const settings =
            await CompanySettings.findOne();


        if (!settings) {

            return res.status(500).json({

                success: false,

                message:
                    "Office attendance location has not been configured.",

            });

        }


        const office =
            settings.officeLocation;


        /* ==========================================
                    GEOFENCE CHECK
        ========================================== */

        const locationCheck =
            isWithinRadius({

                employeeLatitude:
                    latitude,

                employeeLongitude:
                    longitude,

                officeLatitude:
                    office.latitude,

                officeLongitude:
                    office.longitude,

                radius:
                    office.radius,

            });


        if (!locationCheck.allowed) {

            return res.status(403).json({

                success: false,

                message:
                    "You are outside the allowed office attendance area.",

                distance:
                    Math.round(
                        locationCheck.distance
                    ),

            });

        }


        /* ==========================================
                    TODAY
        ========================================== */

        const today =
            new Date()
                .toISOString()
                .split("T")[0];


        /* ==========================================
                FIND ATTENDANCE
        ========================================== */

        const attendance =
            await Attendance.findOne({

                employeeId:
                    employee.employeeId,

                date:
                    today,

            });


        if (!attendance) {

            return res.status(404).json({

                success: false,

                message:
                    "Please check in first.",

            });

        }


        /* ==========================================
                ALREADY CHECKED OUT
        ========================================== */

        if (attendance.checkOut) {

            return res.status(400).json({

                success: false,

                message:
                    "You have already checked out today.",

            });

        }


        /* ==========================================
                    CHECK OUT
        ========================================== */

        const now = new Date();

        attendance.checkOut =
            now;


        /* ==========================================
                CALCULATE WORKING MINUTES
        ========================================== */

        const diff =
            Math.max(

                0,

                Math.floor(

                    (
                        now -
                        attendance.checkIn
                    ) / 60000

                )

            );


        attendance.workingMinutes =
            diff;


        /* ==========================================
                SAVE CHECKOUT LOCATION
        ========================================== */

        attendance.checkOutLocation = {

            latitude,

            longitude,

            distanceFromOffice:
                Math.round(
                    locationCheck.distance
                ),

        };


        await attendance.save();


        /* ==========================================
                    RESPONSE
        ========================================== */

        return res.status(200).json({

            success: true,

            message:
                "Check-out successful.",

            attendance,

        });

    } catch (error) {

        console.error(
            "Check-out error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Server error during check-out.",

        });

    }

};


/* ==========================================
            MY ATTENDANCE
========================================== */

const getMyAttendance = async (req, res) => {

    try {

        const employee =
            req.user;


        const attendance =
            await Attendance.find({

                employeeId:
                    employee.employeeId,

            }).sort({

                date: -1,

            });


        return res.status(200).json({

            success: true,

            count:
                attendance.length,

            attendance,

        });

    } catch (error) {

        console.error(
            "Get attendance error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Server error while fetching attendance.",

        });

    }

};


/* ==========================================
        GET ALL ATTENDANCE - ADMIN
========================================== */

const getAllAttendance = async (req, res) => {

    try {

        const records =
            await Attendance.find()
                .sort({
                    date: -1,
                    createdAt: -1,
                });


        return res.status(200).json({

            success: true,

            count:
                records.length,

            attendance:
                records,

        });

    } catch (error) {

        console.error(
            "Get all attendance error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to fetch attendance records.",

        });

    }

};


/* ==========================================
        GET TODAY ATTENDANCE - ADMIN
========================================== */

const getTodayAttendance = async (req, res) => {

    try {

        const today =
            new Date()
                .toISOString()
                .split("T")[0];


        const records =
            await Attendance.find({

                date:
                    today,

            }).sort({

                createdAt: -1,

            });


        return res.status(200).json({

            success: true,

            date:
                today,

            count:
                records.length,

            attendance:
                records,

        });

    } catch (error) {

        console.error(
            "Get today's attendance error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to fetch today's attendance.",

        });

    }

};


/* ==========================================
                EXPORTS
========================================== */

module.exports = {

    checkIn,

    checkOut,

    getMyAttendance,

    getAllAttendance,

    getTodayAttendance,

};