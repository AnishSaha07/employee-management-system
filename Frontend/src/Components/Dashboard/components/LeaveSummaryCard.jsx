import "./Card.css";

import { useMemo } from "react";
import { FaArrowRight } from "react-icons/fa";

import { useLeave } from "../../../context/LeaveContext";
import { useEmployees } from "../../../context/EmployeeContext";

const LeaveSummaryCard = ({
    setActiveSection,
}) => {

    const {
        leaveRequests = [],
    } = useLeave();

    const {
        currentEmployee,
    } = useEmployees();


    /* ==========================================
       EMPLOYEE LEAVE SUMMARY
    ========================================== */

    const summary = useMemo(() => {

        if (!currentEmployee) {

            return {
                total: 0,
                pending: 0,
                approved: 0,
                rejected: 0,
            };
        }

        const employeeLeaves =
            leaveRequests.filter(
                leave =>
                    leave.employeeId ===
                    currentEmployee.employeeId
            );

        return {

            total:
                employeeLeaves.length,

            pending:
                employeeLeaves.filter(
                    leave =>
                        leave.status === "Pending"
                ).length,

            approved:
                employeeLeaves.filter(
                    leave =>
                        leave.status === "Approved"
                ).length,

            rejected:
                employeeLeaves.filter(
                    leave =>
                        leave.status === "Rejected"
                ).length,

        };

    }, [
        leaveRequests,
        currentEmployee,
    ]);


    /* ==========================================
       APPLY LEAVE
    ========================================== */

    const handleApplyLeave = () => {

        if (setActiveSection) {
            setActiveSection("leave");
        }
    };


    return (
        <div className="dashboard-card">

            <div className="card-header">

                <h3>
                    Leave Summary
                </h3>

                <button
                    type="button"
                    className="link-btn"
                    onClick={handleApplyLeave}
                >
                    Apply Leave
                    <FaArrowRight />
                </button>

            </div>


            <div className="task-summary-grid">

                <div className="task-box">

                    <span>
                        Total
                    </span>

                    <strong>
                        {summary.total}
                    </strong>

                </div>


                <div className="task-box">

                    <span>
                        Pending
                    </span>

                    <strong>
                        {summary.pending}
                    </strong>

                </div>


                <div className="task-box">

                    <span>
                        Approved
                    </span>

                    <strong>
                        {summary.approved}
                    </strong>

                </div>


                <div className="task-box">

                    <span>
                        Rejected
                    </span>

                    <strong>
                        {summary.rejected}
                    </strong>

                </div>

            </div>

        </div>
    );
};

export default LeaveSummaryCard;