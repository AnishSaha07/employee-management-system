import {
    useEffect,
    useMemo,
    useState,
} from "react";

import "./EmployeeLeave.css";

import { FaPlus } from "react-icons/fa";

import { useLeave } from "../../../context/LeaveContext";

import EmployeeLeaveTable from "./EmployeeLeaveTable";

import ApplyLeaveModal from "../Modals/ApplyLeaveModal";

import EmployeeLeaveDetailsModal
    from "../Modals/EmployeeLeaveDetailsModal";


const EmployeeLeave = () => {

    const {
        leaveRequests,
        fetchMyLeaves,
        loading,
        error,
    } = useLeave();


    const [search, setSearch] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("All");

    const [showModal, setShowModal] =
        useState(false);

    const [selectedLeave, setSelectedLeave] =
        useState(null);


    /* ==========================================
                    LOAD MY LEAVES
                    FROM BACKEND
    ========================================== */

    useEffect(() => {

        fetchMyLeaves();

    }, [fetchMyLeaves]);


    /* ==========================================
                    MY LEAVES
    ========================================== */

    /*
        GET /api/leaves/my already returns
        only the logged-in employee's leaves.

        Therefore we don't need to filter by
        currentUser.employeeId here.
    */

    const myLeaves = useMemo(() => {

        return Array.isArray(leaveRequests)
            ? leaveRequests
            : [];

    }, [leaveRequests]);


    /* ==========================================
                    FILTER LEAVES
    ========================================== */

    const filteredLeaves = useMemo(() => {

        const searchValue =
            search.trim().toLowerCase();


        return myLeaves.filter((leave) => {

            const matchesSearch =
                !searchValue ||

                leave.leaveType
                    ?.toLowerCase()
                    .includes(searchValue) ||

                leave.reason
                    ?.toLowerCase()
                    .includes(searchValue);


            const matchesStatus =
                statusFilter === "All" ||

                leave.status ===
                    statusFilter;


            return (
                matchesSearch &&
                matchesStatus
            );

        });

    }, [
        myLeaves,
        search,
        statusFilter,
    ]);


    /* ==========================================
                    SUMMARY
    ========================================== */

    const totalLeaves =
        myLeaves.length;


    const pendingLeaves =
        myLeaves.filter(
            (leave) =>
                leave.status ===
                "Pending"
        ).length;


    const approvedLeaves =
        myLeaves.filter(
            (leave) =>
                leave.status ===
                "Approved"
        ).length;


    const rejectedLeaves =
        myLeaves.filter(
            (leave) =>
                leave.status ===
                "Rejected"
        ).length;


    /* ==========================================
                    LOADING
    ========================================== */

    if (
        loading &&
        leaveRequests.length === 0
    ) {

        return (

            <section className="employee-leave">

                <div className="employee-page-header">

                    <div>

                        <h2>
                            My Leave
                        </h2>

                        <p>
                            Manage your leave requests.
                        </p>

                    </div>

                </div>

                <div className="leave-loading">

                    Loading leave requests...

                </div>

            </section>

        );

    }


    /* ==========================================
                    UI
    ========================================== */

    return (

        <section className="employee-leave">


            {/* =================================
                        HEADER
            ================================= */}

            <div className="employee-page-header">

                <div>

                    <h2>
                        My Leave
                    </h2>

                    <p>
                        Manage your leave requests.
                    </p>

                </div>


                <button
                    type="button"
                    className="apply-btn"
                    onClick={() =>
                        setShowModal(true)
                    }
                    disabled={loading}
                >

                    <FaPlus />

                    {loading
                        ? "Loading..."
                        : "Apply Leave"
                    }

                </button>

            </div>


            {/* =================================
                        ERROR
            ================================= */}

            {error && (

                <div className="error-box">

                    {error}

                </div>

            )}


            {/* =================================
                        SUMMARY
            ================================= */}

            <div className="leave-summary-grid">


                <div className="summary-card">

                    <span>
                        Total
                    </span>

                    <h2>
                        {totalLeaves}
                    </h2>

                </div>


                <div className="summary-card">

                    <span>
                        Pending
                    </span>

                    <h2>
                        {pendingLeaves}
                    </h2>

                </div>


                <div className="summary-card">

                    <span>
                        Approved
                    </span>

                    <h2>
                        {approvedLeaves}
                    </h2>

                </div>


                <div className="summary-card">

                    <span>
                        Rejected
                    </span>

                    <h2>
                        {rejectedLeaves}
                    </h2>

                </div>

            </div>


            {/* =================================
                        TOOLBAR
            ================================= */}

            <div className="employee-toolbar">


                <input
                    type="text"
                    placeholder="Search Leave..."
                    value={search}
                    onChange={(e) =>
                        setSearch(
                            e.target.value
                        )
                    }
                />


                <select
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(
                            e.target.value
                        )
                    }
                >

                    <option value="All">
                        All
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


            {/* =================================
                        TABLE
            ================================= */}

            <EmployeeLeaveTable
                leaves={filteredLeaves}
                onView={setSelectedLeave}
            />


            {/* =================================
                    APPLY LEAVE MODAL
            ================================= */}

            <ApplyLeaveModal
                open={showModal}
                onClose={() =>
                    setShowModal(false)
                }
            />


            {/* =================================
                    DETAILS MODAL
            ================================= */}

            <EmployeeLeaveDetailsModal
                open={!!selectedLeave}
                leave={selectedLeave}
                onClose={() =>
                    setSelectedLeave(null)
                }
            />

        </section>

    );

};


export default EmployeeLeave;