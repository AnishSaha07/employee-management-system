import { useMemo, useState } from "react";

import "./LeaveRequests.css";

import {
    FaCalendarAlt,
    FaCheck,
    FaTimes,
    FaClock,
    FaUser,
    FaClipboardList,
    FaSearch,
    FaFilter,
} from "react-icons/fa";

import { useLeave } from "../../../context/LeaveContext";
import { useEmployees } from "../../../context/EmployeeContext";
import { getCurrentUser } from "../../../utils/auth";
import { useToast } from "../../../context/ToastContext";


const LeaveRequests = () => {

    const {
        leaveRequests,
        approveLeave,
        rejectLeave,
    } = useLeave();

    const {
        employees,
    } = useEmployees();

    const {
        showToast,
    } = useToast();


    const currentUser = getCurrentUser();


    /* ================================
            STATE
    ================================= */

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] =
        useState("All");

    const [typeFilter, setTypeFilter] =
        useState("All");


    /* ================================
            STATISTICS
    ================================= */

    const stats = useMemo(() => {

        return {

            total: leaveRequests.length,

            pending:
                leaveRequests.filter(
                    leave =>
                        leave.status === "Pending"
                ).length,

            approved:
                leaveRequests.filter(
                    leave =>
                        leave.status === "Approved"
                ).length,

            rejected:
                leaveRequests.filter(
                    leave =>
                        leave.status === "Rejected"
                ).length,

        };

    }, [leaveRequests]);


    /* ================================
            LEAVE TYPES
    ================================= */

    const leaveTypes = useMemo(() => {

        const types = leaveRequests
            .map(leave => leave.leaveType)
            .filter(Boolean);

        return [
            "All",
            ...new Set(types),
        ];

    }, [leaveRequests]);


    /* ================================
            FILTER REQUESTS
    ================================= */

    const filteredRequests = useMemo(() => {

        return leaveRequests.filter(leave => {

            const employee =
                employees.find(
                    emp =>
                        emp.employeeId ===
                        leave.employeeId
                );


            const employeeName =
                employee?.name ||
                leave.employeeName ||
                "";


            const searchText =
                `${employeeName}
                ${leave.employeeId || ""}
                ${leave.leaveType || ""}
                ${leave.reason || ""}`
                    .toLowerCase();


            const matchesSearch =
                searchText.includes(
                    search.toLowerCase()
                );


            const matchesStatus =
                statusFilter === "All" ||
                leave.status === statusFilter;


            const matchesType =
                typeFilter === "All" ||
                leave.leaveType === typeFilter;


            return (
                matchesSearch &&
                matchesStatus &&
                matchesType
            );

        });

    }, [
        leaveRequests,
        employees,
        search,
        statusFilter,
        typeFilter,
    ]);


    /* ================================
            EMPLOYEE NAME
    ================================= */

    const getEmployeeName = (leave) => {

        const employee =
            employees.find(
                emp =>
                    emp.employeeId ===
                    leave.employeeId
            );

        return (
            employee?.name ||
            leave.employeeName ||
            "Unknown Employee"
        );

    };


    /* ================================
            APPROVE
    ================================= */

    const handleApprove = (leave) => {

        const adminName =
            currentUser?.name ||
            "Administrator";


        approveLeave(
            leave.id,
            adminName
        );


        showToast(
            "success",
            "Leave Approved",
            `${getEmployeeName(leave)}'s leave request has been approved.`
        );

    };


    /* ================================
            REJECT
    ================================= */

    const handleReject = (leave) => {

        const adminName =
            currentUser?.name ||
            "Administrator";


        rejectLeave(
            leave.id,
            adminName
        );


        showToast(
            "success",
            "Leave Rejected",
            `${getEmployeeName(leave)}'s leave request has been rejected.`
        );

    };


    /* ================================
            STATUS CLASS
    ================================= */

    const getStatusClass = (status) => {

        switch (status) {

            case "Approved":
                return "approved";

            case "Rejected":
                return "rejected";

            case "Pending":
            default:
                return "pending";

        }

    };


    return (

        <section className="leave-requests">


            {/* =================================
                    HEADER
            ================================= */}

            <div className="leave-requests-header">

                <div>

                    <h2>
                        Leave Requests
                    </h2>

                    <p>
                        Review and manage employee leave requests.
                    </p>

                </div>

            </div>


            {/* =================================
                    STATISTICS
            ================================= */}

            <div className="leave-stats">


                <div className="leave-stat-card">

                    <div className="leave-stat-icon blue">

                        <FaClipboardList />

                    </div>

                    <div>

                        <span>
                            Total Requests
                        </span>

                        <strong>
                            {stats.total}
                        </strong>

                    </div>

                </div>


                <div className="leave-stat-card">

                    <div className="leave-stat-icon orange">

                        <FaClock />

                    </div>

                    <div>

                        <span>
                            Pending
                        </span>

                        <strong>
                            {stats.pending}
                        </strong>

                    </div>

                </div>


                <div className="leave-stat-card">

                    <div className="leave-stat-icon green">

                        <FaCheck />

                    </div>

                    <div>

                        <span>
                            Approved
                        </span>

                        <strong>
                            {stats.approved}
                        </strong>

                    </div>

                </div>


                <div className="leave-stat-card">

                    <div className="leave-stat-icon red">

                        <FaTimes />

                    </div>

                    <div>

                        <span>
                            Rejected
                        </span>

                        <strong>
                            {stats.rejected}
                        </strong>

                    </div>

                </div>

            </div>


            {/* =================================
                    FILTER BAR
            ================================= */}

            <div className="leave-filter-card">


                <div className="leave-search">

                    <FaSearch />

                    <input
                        type="text"
                        placeholder="Search employee, ID, leave type..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                </div>


                <div className="leave-filter">

                    <FaFilter />

                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(e.target.value)
                        }
                    >

                        <option value="All">
                            All Status
                        </option>

                        <option value="Pending">
                            Pending
                        </option>

                        <option value="Approved">
                            Approved
                        </option>

                        <option value="Rejected">
                            Rejected
                        </option>

                    </select>

                </div>


                <div className="leave-filter">

                    <FaCalendarAlt />

                    <select
                        value={typeFilter}
                        onChange={(e) =>
                            setTypeFilter(e.target.value)
                        }
                    >

                        {leaveTypes.map(type => (

                            <option
                                key={type}
                                value={type}
                            >
                                {type === "All"
                                    ? "All Leave Types"
                                    : type}
                            </option>

                        ))}

                    </select>

                </div>

            </div>


            {/* =================================
                    REQUEST LIST
            ================================= */}

            <div className="leave-request-card">


                <div className="leave-request-card-header">

                    <div>

                        <h3>
                            Employee Leave Requests
                        </h3>

                        <p>
                            {filteredRequests.length} request
                            {filteredRequests.length !== 1
                                ? "s"
                                : ""} found
                        </p>

                    </div>

                </div>


                {filteredRequests.length === 0 ? (

                    <div className="leave-empty">

                        <FaCalendarAlt />

                        <h3>
                            No Leave Requests
                        </h3>

                        <p>
                            There are no leave requests matching your filters.
                        </p>

                    </div>

                ) : (

                    <div className="leave-table-wrapper">

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
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredRequests.map(
                                    (leave) => (

                                        <tr
                                            key={leave.id}
                                        >


                                            {/* EMPLOYEE */}

                                            <td>

                                                <div className="leave-employee">

                                                    <div className="leave-avatar">

                                                        <FaUser />

                                                    </div>

                                                    <div>

                                                        <strong>
                                                            {getEmployeeName(
                                                                leave
                                                            )}
                                                        </strong>

                                                        <span>
                                                            {leave.employeeId ||
                                                                "--"}
                                                        </span>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* TYPE */}

                                            <td>

                                                <span className="leave-type">

                                                    {leave.leaveType ||
                                                        "--"}

                                                </span>

                                            </td>


                                            {/* FROM */}

                                            <td>

                                                <span className="leave-date">

                                                    {leave.fromDate ||
                                                        "--"}

                                                </span>

                                            </td>


                                            {/* TO */}

                                            <td>

                                                <span className="leave-date">

                                                    {leave.toDate ||
                                                        "--"}

                                                </span>

                                            </td>


                                            {/* REASON */}

                                            <td>

                                                <div className="leave-reason">

                                                    {leave.reason ||
                                                        "No reason provided"}

                                                </div>

                                            </td>


                                            {/* STATUS */}

                                            <td>

                                                <span
                                                    className={
                                                        `leave-status ${
                                                            getStatusClass(
                                                                leave.status
                                                            )
                                                        }`
                                                    }
                                                >

                                                    {leave.status ||
                                                        "Pending"}

                                                </span>

                                            </td>


                                            {/* ACTION */}

                                            <td>

                                                {leave.status ===
                                                "Pending" ? (

                                                    <div className="leave-actions">


                                                        <button
                                                            type="button"
                                                            className="approve-leave-btn"
                                                            title="Approve Leave"
                                                            onClick={() =>
                                                                handleApprove(
                                                                    leave
                                                                )
                                                            }
                                                        >

                                                            <FaCheck />

                                                        </button>


                                                        <button
                                                            type="button"
                                                            className="reject-leave-btn"
                                                            title="Reject Leave"
                                                            onClick={() =>
                                                                handleReject(
                                                                    leave
                                                                )
                                                            }
                                                        >

                                                            <FaTimes />

                                                        </button>

                                                    </div>

                                                ) : (

                                                    <span className="leave-action-done">

                                                        {leave.status}

                                                    </span>

                                                )}

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </section>

    );

};


export default LeaveRequests;