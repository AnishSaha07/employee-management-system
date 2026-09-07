import "./LeaveTable.css";

import {
    FaCheck,
    FaTimes,
} from "react-icons/fa";

import { useState } from "react";

import { useLeave } from "../../../context/LeaveContext";

import { useToast } from "../../../context/ToastContext";


const LeaveTable = ({
    leaveRequests = [],
}) => {

    const {
        approveLeave,
        rejectLeave,
    } = useLeave();

    const { showToast } = useToast();

    const [processingId, setProcessingId] =
        useState(null);


    /* ==========================================
                    FORMAT DATE
    ========================================== */

    const formatDate = (value) => {

        if (!value) {
            return "--";
        }

        const date =
            new Date(value);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return "--";
        }

        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );

    };


    /* ==========================================
                    APPROVE
    ========================================== */

    const handleApprove = async (leave) => {

        const leaveId =
            leave._id || leave.id;

        if (!leaveId) {
            return;
        }

        try {

            setProcessingId(leaveId);

            const result =
                await approveLeave(
                    leaveId
                );

            if (result?.success) {

                showToast(
                    "success",
                    "Leave Approved",
                    "Leave request approved successfully."
                );

            } else {

                showToast(
                    "error",
                    "Approval Failed",
                    result?.message ||
                        "Failed to approve leave request."
                );

            }

        } catch (error) {

            console.error(
                "Approve leave error:",
                error
            );

            showToast(
                "error",
                "Approval Failed",
                "Failed to approve leave request."
            );

        } finally {

            setProcessingId(null);

        }

    };


    /* ==========================================
                    REJECT
    ========================================== */

    const handleReject = async (leave) => {

        const leaveId =
            leave._id || leave.id;

        if (!leaveId) {
            return;
        }

        try {

            setProcessingId(leaveId);

            const result =
                await rejectLeave(
                    leaveId
                );

            if (result?.success) {

                showToast(
                    "success",
                    "Leave Rejected",
                    "Leave request rejected successfully."
                );

            } else {

                showToast(
                    "error",
                    "Rejection Failed",
                    result?.message ||
                        "Failed to reject leave request."
                );

            }

        } catch (error) {

            console.error(
                "Reject leave error:",
                error
            );

            showToast(
                "error",
                "Rejection Failed",
                "Failed to reject leave request."
            );

        } finally {

            setProcessingId(null);

        }

    };


    return (

        <div className="leave-table-card">

            <table className="leave-table">

                <thead>

                    <tr>

                        <th>
                            Employee
                        </th>

                        <th>
                            Leave Type
                        </th>

                        <th>
                            From
                        </th>

                        <th>
                            To
                        </th>

                        <th>
                            Reason
                        </th>

                        <th>
                            Status
                        </th>

                        <th>
                            Actions
                        </th>

                    </tr>

                </thead>


                <tbody>

                    {leaveRequests.length === 0 ? (

                        <tr>

                            <td
                                colSpan="7"
                                className="empty-row"
                            >

                                No Leave Requests

                            </td>

                        </tr>

                    ) : (

                        leaveRequests.map(
                            (leave) => {

                                const leaveId =
                                    leave._id ||
                                    leave.id;

                                const isProcessing =
                                    processingId ===
                                    leaveId;


                                return (

                                    <tr
                                        key={leaveId}
                                    >


                                        {/* EMPLOYEE */}

                                        <td>

                                            <div className="employee-name">

                                                <h4>
                                                    {
                                                        leave.employeeName ||
                                                        "--"
                                                    }
                                                </h4>

                                                <span>
                                                    {
                                                        leave.employeeId ||
                                                        "--"
                                                    }
                                                </span>

                                            </div>

                                        </td>


                                        {/* TYPE */}

                                        <td>

                                            {
                                                leave.leaveType ||
                                                "--"
                                            }

                                        </td>


                                        {/* FROM */}

                                        <td>

                                            {formatDate(
                                                leave.fromDate
                                            )}

                                        </td>


                                        {/* TO */}

                                        <td>

                                            {formatDate(
                                                leave.toDate
                                            )}

                                        </td>


                                        {/* REASON */}

                                        <td>

                                            <span
                                                title={
                                                    leave.reason
                                                }
                                            >

                                                {
                                                    leave.reason ||
                                                    "--"
                                                }

                                            </span>

                                        </td>


                                        {/* STATUS */}

                                        <td>

                                            <span
                                                className={`leave-status ${
                                                    leave.status
                                                        ?.toLowerCase()
                                                        .replace(
                                                            /\s+/g,
                                                            "-"
                                                        ) ||
                                                    "pending"
                                                }`}
                                            >

                                                {
                                                    leave.status ||
                                                    "Pending"
                                                }

                                            </span>

                                        </td>


                                        {/* ACTIONS */}

                                        <td>

                                            {
                                                leave.status ===
                                                "Pending"

                                                    ? (

                                                        <div className="leave-actions">


                                                            <button
                                                                type="button"
                                                                className="approve-btn"
                                                                onClick={() =>
                                                                    handleApprove(
                                                                        leave
                                                                    )
                                                                }
                                                                disabled={
                                                                    isProcessing
                                                                }
                                                                title="Approve Leave"
                                                            >

                                                                <FaCheck />

                                                            </button>


                                                            <button
                                                                type="button"
                                                                className="reject-btn"
                                                                onClick={() =>
                                                                    handleReject(
                                                                        leave
                                                                    )
                                                                }
                                                                disabled={
                                                                    isProcessing
                                                                }
                                                                title="Reject Leave"
                                                            >

                                                                <FaTimes />

                                                            </button>

                                                        </div>

                                                    )

                                                    : (

                                                        <span>
                                                            —
                                                        </span>

                                                    )
                                            }

                                        </td>

                                    </tr>

                                );

                            }
                        )

                    )}

                </tbody>

            </table>

        </div>

    );

};


export default LeaveTable;