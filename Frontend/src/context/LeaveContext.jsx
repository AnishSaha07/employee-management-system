/* eslint-disable react-refresh/only-export-components */

import {
    createContext,
    useContext,
    
    useState,
    useCallback,
} from "react";

import api from "../services/api";


const LeaveContext = createContext();


/* ==========================================
                PROVIDER
========================================== */

export const LeaveProvider = ({ children }) => {

    const [leaveRequests, setLeaveRequests] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    /* ==========================================
                GET MY LEAVES
            EMPLOYEE ONLY
    ========================================== */

    const fetchMyLeaves = useCallback(async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await api.get("/leaves/my");

            const leaves =
                response.data.leaves || [];

            setLeaveRequests(leaves);

            return {
                success: true,
                leaves,
            };

        } catch (error) {

            console.error(
                "Fetch my leaves error:",
                error
            );

            const message =
                error.response?.data?.message ||
                "Failed to load your leave requests.";

            setError(message);

            return {
                success: false,
                message,
            };

        } finally {

            setLoading(false);

        }

    }, []);


    /* ==========================================
                GET ALL LEAVES
                ADMIN ONLY
    ========================================== */

    const fetchAllLeaves = useCallback(async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await api.get("/leaves");

            const leaves =
                response.data.leaves || [];

            setLeaveRequests(leaves);

            return {
                success: true,
                leaves,
            };

        } catch (error) {

            console.error(
                "Fetch all leaves error:",
                error
            );

            const message =
                error.response?.data?.message ||
                "Failed to load leave requests.";

            setError(message);

            return {
                success: false,
                message,
            };

        } finally {

            setLoading(false);

        }

    }, []);


    /* ==========================================
                    APPLY LEAVE
                EMPLOYEE ONLY
    ========================================== */

    const applyLeave = async (leave) => {

        try {

            setLoading(true);
            setError("");


            /*
                IMPORTANT:

                Do NOT send:
                employee
                employeeId
                employeeName

                Backend gets employee identity
                from JWT req.user.
            */

            const response =
                await api.post(
                    "/leaves",
                    {
                        leaveType:
                            leave.leaveType,

                        fromDate:
                            leave.fromDate,

                        toDate:
                            leave.toDate,

                        reason:
                            leave.reason,
                    }
                );


            const newLeave =
                response.data.leave;


            /*
                Add newly created leave
                to local React state.
            */

            setLeaveRequests((prev) => [
                newLeave,
                ...prev,
            ]);


            return {

                success: true,

                leave:
                    newLeave,

                message:
                    response.data.message ||
                    "Leave request submitted successfully.",

            };

        } catch (error) {

            console.error(
                "Apply leave error:",
                error
            );

            const message =
                error.response?.data?.message ||
                "Failed to apply for leave.";

            setError(message);

            return {

                success: false,

                message,

            };

        } finally {

            setLoading(false);

        }

    };


    /* ==========================================
                    APPROVE LEAVE
                ADMIN ONLY
    ========================================== */

    const approveLeave = async (id) => {

        try {

            setLoading(true);
            setError("");


            const response =
                await api.put(
                    `/leaves/${id}/approve`
                );


            const updatedLeave =
                response.data.leave;


            /*
                Update the specific leave
                inside React state.
            */

            setLeaveRequests((prev) =>
                prev.map((leave) =>
                    leave._id ===
                    updatedLeave._id
                        ? updatedLeave
                        : leave
                )
            );


            return {

                success: true,

                leave:
                    updatedLeave,

                message:
                    response.data.message ||
                    "Leave request approved successfully.",

            };

        } catch (error) {

            console.error(
                "Approve leave error:",
                error
            );

            const message =
                error.response?.data?.message ||
                "Failed to approve leave request.";

            setError(message);

            return {

                success: false,

                message,

            };

        } finally {

            setLoading(false);

        }

    };


    /* ==========================================
                    REJECT LEAVE
                ADMIN ONLY
    ========================================== */

    const rejectLeave = async (id) => {

        try {

            setLoading(true);
            setError("");


            const response =
                await api.put(
                    `/leaves/${id}/reject`
                );


            const updatedLeave =
                response.data.leave;


            /*
                Update the specific leave
                inside React state.
            */

            setLeaveRequests((prev) =>
                prev.map((leave) =>
                    leave._id ===
                    updatedLeave._id
                        ? updatedLeave
                        : leave
                )
            );


            return {

                success: true,

                leave:
                    updatedLeave,

                message:
                    response.data.message ||
                    "Leave request rejected successfully.",

            };

        } catch (error) {

            console.error(
                "Reject leave error:",
                error
            );

            const message =
                error.response?.data?.message ||
                "Failed to reject leave request.";

            setError(message);

            return {

                success: false,

                message,

            };

        } finally {

            setLoading(false);

        }

    };


    /* ==========================================
                    GET LEAVE BY ID
            EMPLOYEE / ADMIN
    ========================================== */

    const getLeaveById = async (id) => {

        try {

            setLoading(true);
            setError("");


            const response =
                await api.get(
                    `/leaves/${id}`
                );


            return {

                success: true,

                leave:
                    response.data.leave,

            };

        } catch (error) {

            console.error(
                "Get leave error:",
                error
            );

            const message =
                error.response?.data?.message ||
                "Failed to fetch leave request.";

            setError(message);

            return {

                success: false,

                message,

            };

        } finally {

            setLoading(false);

        }

    };


    /* ==========================================
                EMPLOYEE LEAVES
    ========================================== */

    const getEmployeeLeaves = useCallback(
        (employeeId) => {

            /*
                The employee page already loads
                only its own leaves from:

                    GET /api/leaves/my

                Therefore we filter the current
                state here for compatibility with
                your existing EmployeeLeave.jsx.

                Admin can also use this function
                against the all-leaves state.
            */

            if (!employeeId) {
                return [];
            }

            return leaveRequests.filter(
                (leave) =>
                    leave.employeeId ===
                    employeeId
            );

        },
        [leaveRequests]
    );


    /* ==========================================
            EMPLOYEES ON LEAVE TODAY
    ========================================== */

    const getEmployeesOnLeaveToday =
        useCallback(() => {

            const today =
                new Date()
                    .toISOString()
                    .split("T")[0];


            return leaveRequests.filter(
                (leave) => {

                    if (
                        leave.status !==
                        "Approved"
                    ) {
                        return false;
                    }


                    /*
                        MongoDB returns Date fields
                        as ISO strings to React.
                    */

                    const fromDate =
                        new Date(
                            leave.fromDate
                        )
                            .toISOString()
                            .split("T")[0];


                    const toDate =
                        new Date(
                            leave.toDate
                        )
                            .toISOString()
                            .split("T")[0];


                    return (
                        fromDate <= today &&
                        toDate >= today
                    );

                }
            );

        }, [leaveRequests]);


    /* ==========================================
                INITIAL LOAD
    ========================================== */

    /* ==========================================
                    PROVIDER
    ========================================== */

    return (

        <LeaveContext.Provider
            value={{

                /* Employee */

                leaveRequests,

                applyLeave,

                fetchMyLeaves,

                getEmployeeLeaves,

                getLeaveById,


                /* Admin */

                fetchAllLeaves,

                approveLeave,

                rejectLeave,


                /* Dashboard */

                getEmployeesOnLeaveToday,


                /* Common */

                loading,

                error,

            }}
        >

            {children}

        </LeaveContext.Provider>

    );

};


/* ==========================================
                HOOK
========================================== */

export const useLeave = () =>
    useContext(LeaveContext);