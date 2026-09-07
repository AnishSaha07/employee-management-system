const Leave = require("../models/Leave");


/* ==========================================
                APPLY LEAVE
        EMPLOYEE ONLY
========================================== */

const applyLeave = async (req, res) => {
    try {

        // Employee comes from JWT middleware
        const employee = req.user;

        const {
            leaveType,
            fromDate,
            toDate,
            reason,
        } = req.body;


        /* ==========================================
                    VALIDATION
        ========================================== */

        if (
            !leaveType ||
            !fromDate ||
            !toDate ||
            !reason
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Leave type, start date, end date and reason are required.",
            });
        }


        /* ==========================================
                    DATE VALIDATION
        ========================================== */

        const startDate = new Date(fromDate);
        const endDate = new Date(toDate);

        if (
            Number.isNaN(startDate.getTime()) ||
            Number.isNaN(endDate.getTime())
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid leave dates.",
            });
        }


        if (startDate > endDate) {
            return res.status(400).json({
                success: false,
                message:
                    "Leave start date cannot be after end date.",
            });
        }


        /* ==========================================
                CHECK OVERLAPPING LEAVE
        ========================================== */

        const overlappingLeave = await Leave.findOne({
            employee: employee._id,

            status: {
                $in: ["Pending", "Approved"],
            },

            fromDate: {
                $lte: endDate,
            },

            toDate: {
                $gte: startDate,
            },
        });


        if (overlappingLeave) {
            return res.status(400).json({
                success: false,
                message:
                    "You already have a pending or approved leave for these dates.",
            });
        }


        /* ==========================================
                    CREATE LEAVE
        ========================================== */

        const leave = await Leave.create({

            // IMPORTANT:
            // Identity comes from JWT,
            // not from frontend.

            employee: employee._id,

            employeeId:
                employee.employeeId,

            employeeName:
                employee.name,

            leaveType:
                leaveType.trim(),

            fromDate:
                startDate,

            toDate:
                endDate,

            reason:
                reason.trim(),

            status: "Pending",
        });


        /* ==========================================
                    RESPONSE
        ========================================== */

        return res.status(201).json({

            success: true,

            message:
                "Leave request submitted successfully.",

            leave,
        });

    } catch (error) {

        console.error(
            "Apply leave error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error while applying for leave.",
        });
    }
};


/* ==========================================
                MY LEAVES
        EMPLOYEE ONLY
========================================== */

const getMyLeaves = async (req, res) => {
    try {

        const employee = req.user;

        const leaves = await Leave.find({
            employee: employee._id,
        }).sort({
            createdAt: -1,
        });


        return res.status(200).json({

            success: true,

            count:
                leaves.length,

            leaves,
        });

    } catch (error) {

        console.error(
            "Get my leaves error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to fetch your leave requests.",
        });
    }
};


/* ==========================================
                GET LEAVE
        EMPLOYEE / ADMIN
========================================== */

const getLeaveById = async (req, res) => {
    try {

        const leave =
            await Leave.findById(req.params.id);

        if (!leave) {
            return res.status(404).json({
                success: false,
                message:
                    "Leave request not found.",
            });
        }


        /* ==========================================
                EMPLOYEE OWNERSHIP CHECK
        ========================================== */

        if (
            req.user.role !== "admin" &&
            leave.employee.toString() !==
                req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "You do not have permission to view this leave request.",
            });
        }


        return res.status(200).json({

            success: true,

            leave,
        });

    } catch (error) {

        console.error(
            "Get leave error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to fetch leave request.",
        });
    }
};


/* ==========================================
            GET ALL LEAVES
                ADMIN ONLY
========================================== */

const getAllLeaves = async (req, res) => {
    try {

        const leaves = await Leave.find()
            .sort({
                createdAt: -1,
            });


        return res.status(200).json({

            success: true,

            count:
                leaves.length,

            leaves,
        });

    } catch (error) {

        console.error(
            "Get all leaves error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to fetch leave requests.",
        });
    }
};


/* ==========================================
            APPROVE LEAVE
                ADMIN ONLY
========================================== */

const approveLeave = async (req, res) => {
    try {

        const leave =
            await Leave.findById(
                req.params.id
            );

        if (!leave) {
            return res.status(404).json({
                success: false,
                message:
                    "Leave request not found.",
            });
        }


        /* ==========================================
                    STATUS CHECK
        ========================================== */

        if (leave.status !== "Pending") {
            return res.status(400).json({
                success: false,
                message:
                    `Leave request is already ${leave.status.toLowerCase()}.`,
            });
        }


        /* ==========================================
                    APPROVE
        ========================================== */

        leave.status = "Approved";

        leave.approvedBy =
            req.user._id;

        leave.approvedAt =
            new Date();

        // Clear rejection information
        leave.rejectedBy = null;

        leave.rejectedAt = null;


        await leave.save();


        return res.status(200).json({

            success: true,

            message:
                "Leave request approved successfully.",

            leave,
        });

    } catch (error) {

        console.error(
            "Approve leave error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to approve leave request.",
        });
    }
};


/* ==========================================
            REJECT LEAVE
                ADMIN ONLY
========================================== */

const rejectLeave = async (req, res) => {
    try {

        const leave =
            await Leave.findById(
                req.params.id
            );

        if (!leave) {
            return res.status(404).json({
                success: false,
                message:
                    "Leave request not found.",
            });
        }


        /* ==========================================
                    STATUS CHECK
        ========================================== */

        if (leave.status !== "Pending") {
            return res.status(400).json({
                success: false,
                message:
                    `Leave request is already ${leave.status.toLowerCase()}.`,
            });
        }


        /* ==========================================
                    REJECT
        ========================================== */

        leave.status = "Rejected";

        leave.rejectedBy =
            req.user._id;

        leave.rejectedAt =
            new Date();

        // Clear approval information
        leave.approvedBy = null;

        leave.approvedAt = null;


        await leave.save();


        return res.status(200).json({

            success: true,

            message:
                "Leave request rejected successfully.",

            leave,
        });

    } catch (error) {

        console.error(
            "Reject leave error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to reject leave request.",
        });
    }
};


/* ==========================================
                    EXPORTS
========================================== */

module.exports = {

    applyLeave,

    getMyLeaves,

    getLeaveById,

    getAllLeaves,

    approveLeave,

    rejectLeave,

};