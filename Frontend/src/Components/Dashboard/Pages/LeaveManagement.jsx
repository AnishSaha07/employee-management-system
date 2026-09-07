import {
    useEffect,
    useMemo,
    useState,
} from "react";

import "./LeaveManagement.css";

import { useLeave } from "../../../context/LeaveContext";

import LeaveTable from "./LeaveTable";


const LeaveManagement = () => {

    const {
        leaveRequests,
        fetchAllLeaves,
        loading,
        error,
    } = useLeave();


    const [search, setSearch] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("All");


    /* ==========================================
                LOAD ALL LEAVE REQUESTS
                    ADMIN ONLY
    ========================================== */

    useEffect(() => {

        fetchAllLeaves();

    }, [fetchAllLeaves]);


    /* ==========================================
                    FILTER
    ========================================== */

    const filteredLeaves = useMemo(() => {

        const searchValue =
            search.trim().toLowerCase();


        return leaveRequests.filter(
            (leave) => {

                const matchesSearch =
                    !searchValue ||
                    leave.employeeName
                        ?.toLowerCase()
                        .includes(searchValue) ||
                    leave.employeeId
                        ?.toLowerCase()
                        .includes(searchValue) ||
                    leave.leaveType
                        ?.toLowerCase()
                        .includes(searchValue);


                const matchesStatus =
                    statusFilter === "All" ||
                    leave.status === statusFilter;


                return (
                    matchesSearch &&
                    matchesStatus
                );

            }
        );

    }, [
        leaveRequests,
        search,
        statusFilter,
    ]);


    /* ==========================================
                    SUMMARY
    ========================================== */

    const pending =
        leaveRequests.filter(
            (leave) =>
                leave.status === "Pending"
        ).length;


    const approved =
        leaveRequests.filter(
            (leave) =>
                leave.status === "Approved"
        ).length;


    const rejected =
        leaveRequests.filter(
            (leave) =>
                leave.status === "Rejected"
        ).length;


    /* ==========================================
                    LOADING
    ========================================== */

    if (
        loading &&
        leaveRequests.length === 0
    ) {

        return (

            <section className="leave-management">

                <div className="leave-header">

                    <div>

                        <h2>
                            Leave Management
                        </h2>

                        <p>
                            Review and manage employee leave requests.
                        </p>

                    </div>

                </div>

                <p>
                    Loading leave requests...
                </p>

            </section>

        );

    }


    return (

        <section className="leave-management">


            {/* =================================
                        HEADER
            ================================= */}

            <div className="leave-header">

                <div>

                    <h2>
                        Leave Management
                    </h2>

                    <p>
                        Review and manage employee leave requests.
                    </p>

                </div>

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

            <div className="leave-summary">


                <div className="summary-card">

                    <h4>
                        Pending
                    </h4>

                    <h2>
                        {pending}
                    </h2>

                </div>


                <div className="summary-card">

                    <h4>
                        Approved
                    </h4>

                    <h2>
                        {approved}
                    </h2>

                </div>


                <div className="summary-card">

                    <h4>
                        Rejected
                    </h4>

                    <h2>
                        {rejected}
                    </h2>

                </div>

            </div>


            {/* =================================
                        FILTERS
            ================================= */}

            <div className="leave-filters">

                <input
                    type="text"
                    placeholder="Search employee..."
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

            <LeaveTable
                leaveRequests={
                    filteredLeaves
                }
            />

        </section>

    );

};


export default LeaveManagement;