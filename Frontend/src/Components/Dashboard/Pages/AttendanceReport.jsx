import { useEffect, useMemo, useState } from "react";

import "./AttendanceReport.css";

import {
    FaCalendarCheck,
    FaUser,
    FaClock,
    FaCheckCircle,
    FaTimesCircle,
    FaExclamationCircle,
    FaSearch,
} from "react-icons/fa";

import { useAttendance } from "../../../context/AttendenceContext";
import { useEmployees } from "../../../context/EmployeeContext";

const AttendanceReport = () => {

    const {
        adminAttendance = [],
        loading,
        error,
        fetchAllAttendance,
    } = useAttendance();

    const {
        employees = [],
        loading: employeesLoading,
    } = useEmployees();

    const [selectedEmployeeId, setSelectedEmployeeId] =
        useState("");

    const [selectedStatus, setSelectedStatus] =
        useState("All");

    const [selectedMonth, setSelectedMonth] =
        useState("");

    /*
    ==========================================
            LOAD ALL ATTENDANCE
    ==========================================
    */

    useEffect(() => {

        fetchAllAttendance();

    }, [fetchAllAttendance]);


    /*
    ==========================================
                EMPLOYEE LIST
    ==========================================
    */

    const employeeList = useMemo(() => {

        return employees.filter(
            (employee) =>
                employee.role === "employee"
        );

    }, [employees]);


    /*
    ==========================================
            FILTER ATTENDANCE
    ==========================================
    */

    const filteredAttendance = useMemo(() => {

        return adminAttendance.filter(
            (record) => {

                const employeeMatch =
                    !selectedEmployeeId ||
                    record.employeeId ===
                        selectedEmployeeId;

                const statusMatch =
                    selectedStatus === "All" ||
                    record.status ===
                        selectedStatus;

                let monthMatch = true;

                if (selectedMonth) {

                    const recordDate =
                        record.date || "";

                    monthMatch =
                        recordDate.startsWith(
                            selectedMonth
                        );
                }

                return (
                    employeeMatch &&
                    statusMatch &&
                    monthMatch
                );
            }
        );

    }, [
        adminAttendance,
        selectedEmployeeId,
        selectedStatus,
        selectedMonth,
    ]);


    /*
    ==========================================
                SUMMARY
    ==========================================
    */

    const totalRecords =
        filteredAttendance.length;

    const presentDays =
        filteredAttendance.filter(
            (record) =>
                record.status === "Present"
        ).length;

    const absentDays =
        filteredAttendance.filter(
            (record) =>
                record.status === "Absent"
        ).length;

    const lateDays =
        filteredAttendance.filter(
            (record) =>
                record.status === "Late"
        ).length;

    const attendancePercentage =
        totalRecords > 0
            ? Math.round(
                  (presentDays /
                      totalRecords) *
                      100
              )
            : 0;


    /*
    ==========================================
            FORMAT DATE
    ==========================================
    */

    const formatDate = (date) => {

        if (!date) {
            return "--";
        }

        const parsedDate =
            new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return date;
        }

        return parsedDate.toLocaleDateString(
            "en-IN"
        );
    };


    /*
    ==========================================
            FORMAT TIME
    ==========================================
    */

    const formatTime = (time) => {

        if (!time) {
            return "--";
        }

        const parsedTime =
            new Date(time);

        if (
            Number.isNaN(
                parsedTime.getTime()
            )
        ) {
            return time;
        }

        return parsedTime.toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    };


    /*
    ==========================================
            WORKING HOURS
    ==========================================
    */

    const formatWorkingHours = (
        record
    ) => {

        if (
            record.workingHours !==
                undefined &&
            record.workingHours !==
                null &&
            record.workingHours !== ""
        ) {
            return `${record.workingHours} hrs`;
        }

        if (
            record.checkIn &&
            record.checkOut
        ) {

            const checkIn =
                new Date(
                    record.checkIn
                );

            const checkOut =
                new Date(
                    record.checkOut
                );

            if (
                !Number.isNaN(
                    checkIn.getTime()
                ) &&
                !Number.isNaN(
                    checkOut.getTime()
                )
            ) {

                const difference =
                    checkOut.getTime() -
                    checkIn.getTime();

                if (difference >= 0) {

                    const hours =
                        difference /
                        (1000 * 60 * 60);

                    return `${hours.toFixed(
                        2
                    )} hrs`;
                }
            }
        }

        return "--";
    };


    /*
    ==========================================
            STATUS CLASS
    ==========================================
    */

    const getStatusClass = (
        status
    ) => {

        switch (status) {

            case "Present":
                return "present";

            case "Absent":
                return "absent";

            case "Late":
                return "late";

            default:
                return "";
        }
    };


    /*
    ==========================================
            LOADING
    ==========================================
    */

    if (
        loading ||
        employeesLoading
    ) {

        return (
            <div className="attendance-report">

                <div className="attendance-empty-state">

                    <FaCalendarCheck />

                    <h3>
                        Loading Attendance Report
                    </h3>

                    <p>
                        Loading attendance
                        records...
                    </p>

                </div>

            </div>
        );
    }


    /*
    ==========================================
                ERROR
    ==========================================
    */

    if (error) {

        return (
            <div className="attendance-report">

                <div className="attendance-empty-state error-state">

                    <FaExclamationCircle />

                    <h3>
                        Unable to Load Attendance
                    </h3>

                    <p>
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={
                            fetchAllAttendance
                        }
                        className="attendance-retry-btn"
                    >
                        Try Again
                    </button>

                </div>

            </div>
        );
    }


    /*
    ==========================================
                MAIN REPORT
    ==========================================
    */

    return (

        <div className="attendance-report">

            {/* =================================
                    HEADER
            ================================= */}

            <div className="attendance-report-header">

                <div>

                    <h3>
                        Attendance Report
                    </h3>

                    <p>
                        View employee attendance,
                        check-in, check-out and
                        working hours.
                    </p>

                </div>

                <div className="attendance-report-icon">

                    <FaCalendarCheck />

                </div>

            </div>


            {/* =================================
                    FILTERS
            ================================= */}

            <div className="attendance-filters">

                {/* EMPLOYEE */}

                <div className="attendance-filter-group">

                    <label>
                        Employee
                    </label>

                    <div className="attendance-select-wrapper">

                        <FaUser />

                        <select
                            value={
                                selectedEmployeeId
                            }
                            onChange={(e) =>
                                setSelectedEmployeeId(
                                    e.target.value
                                )
                            }
                        >

                            <option value="">
                                All Employees
                            </option>

                            {employeeList.map(
                                (employee) => (

                                    <option
                                        key={
                                            employee._id ||
                                            employee.id ||
                                            employee.employeeId
                                        }
                                        value={
                                            employee.employeeId
                                        }
                                    >
                                        {employee.name}
                                        {" - "}
                                        {
                                            employee.employeeId
                                        }
                                    </option>

                                )
                            )}

                        </select>

                    </div>

                </div>


                {/* STATUS */}

                <div className="attendance-filter-group">

                    <label>
                        Status
                    </label>

                    <select
                        value={
                            selectedStatus
                        }
                        onChange={(e) =>
                            setSelectedStatus(
                                e.target.value
                            )
                        }
                    >

                        <option value="All">
                            All Status
                        </option>

                        <option value="Present">
                            Present
                        </option>

                        <option value="Absent">
                            Absent
                        </option>

                        <option value="Late">
                            Late
                        </option>

                    </select>

                </div>


                {/* MONTH */}

                <div className="attendance-filter-group">

                    <label>
                        Month
                    </label>

                    <input
                        type="month"
                        value={
                            selectedMonth
                        }
                        onChange={(e) =>
                            setSelectedMonth(
                                e.target.value
                            )
                        }
                    />

                </div>


                {/* CLEAR */}

                <div className="attendance-filter-action">

                    <button
                        type="button"
                        onClick={() => {

                            setSelectedEmployeeId(
                                ""
                            );

                            setSelectedStatus(
                                "All"
                            );

                            setSelectedMonth(
                                ""
                            );

                        }}
                    >
                        <FaSearch />
                        Reset
                    </button>

                </div>

            </div>


            {/* =================================
                    SUMMARY CARDS
            ================================= */}

            <div className="attendance-summary">

                <SummaryCard
                    icon={<FaCalendarCheck />}
                    title="Total Records"
                    value={totalRecords}
                />

                <SummaryCard
                    icon={<FaCheckCircle />}
                    title="Present"
                    value={presentDays}
                    type="present"
                />

                <SummaryCard
                    icon={<FaTimesCircle />}
                    title="Absent"
                    value={absentDays}
                    type="absent"
                />

                <SummaryCard
                    icon={<FaExclamationCircle />}
                    title="Late"
                    value={lateDays}
                    type="late"
                />

                <SummaryCard
                    icon={<FaUser />}
                    title="Attendance"
                    value={`${attendancePercentage}%`}
                    type="percentage"
                />

            </div>


            {/* =================================
                    ATTENDANCE TABLE
            ================================= */}

            <div className="attendance-table-section">

                <div className="attendance-table-header">

                    <div>

                        <h3>
                            Attendance History
                        </h3>

                        <p>
                            {filteredAttendance.length}
                            {" "}
                            record
                            {filteredAttendance.length !== 1
                                ? "s"
                                : ""}
                        </p>

                    </div>

                </div>


                {filteredAttendance.length === 0 ? (

                    <div className="attendance-empty-table">

                        <FaCalendarCheck />

                        <h3>
                            No Attendance Records
                        </h3>

                        <p>
                            No attendance records
                            match the selected
                            filters.
                        </p>

                    </div>

                ) : (

                    <div className="attendance-table-wrapper">

                        <table>

                            <thead>

                                <tr>

                                    <th>
                                        Employee
                                    </th>

                                    <th>
                                        Employee ID
                                    </th>

                                    <th>
                                        Date
                                    </th>

                                    <th>
                                        Check In
                                    </th>

                                    <th>
                                        Check Out
                                    </th>

                                    <th>
                                        Working Hours
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {filteredAttendance.map(
                                    (record) => (

                                        <tr
                                            key={
                                                record._id ||
                                                record.id ||
                                                `${record.employeeId}-${record.date}`
                                            }
                                        >

                                            <td>

                                                <div className="attendance-employee">

                                                    <div className="attendance-avatar">

                                                        {record.employeeName
                                                            ?.charAt(
                                                                0
                                                            )
                                                            .toUpperCase() ||
                                                            "E"}

                                                    </div>

                                                    <strong>
                                                        {
                                                            record.employeeName ||
                                                            "--"
                                                        }
                                                    </strong>

                                                </div>

                                            </td>


                                            <td>
                                                {
                                                    record.employeeId ||
                                                    "--"
                                                }
                                            </td>


                                            <td>
                                                {
                                                    formatDate(
                                                        record.date
                                                    )
                                                }
                                            </td>


                                            <td>
                                                <div className="attendance-time">

                                                    <FaClock />

                                                    {
                                                        formatTime(
                                                            record.checkIn
                                                        )
                                                    }

                                                </div>
                                            </td>


                                            <td>
                                                <div className="attendance-time">

                                                    <FaClock />

                                                    {
                                                        formatTime(
                                                            record.checkOut
                                                        )
                                                    }

                                                </div>
                                            </td>


                                            <td>
                                                {
                                                    formatWorkingHours(
                                                        record
                                                    )
                                                }
                                            </td>


                                            <td>

                                                <span
                                                    className={`attendance-status ${getStatusClass(
                                                        record.status
                                                    )}`}
                                                >

                                                    {
                                                        record.status ||
                                                        "--"
                                                    }

                                                </span>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>


            {/* =================================
                    FOOTER
            ================================= */}

            <div className="attendance-report-footer">

                <span>
                    Report generated on{" "}
                    {new Date().toLocaleDateString(
                        "en-IN"
                    )}
                </span>

                <span>
                    Showing{" "}
                    {filteredAttendance.length}
                    {" "}
                    of{" "}
                    {adminAttendance.length}
                    {" "}
                    records
                </span>

            </div>

        </div>
    );
};


/*
==========================================
            SUMMARY CARD
==========================================
*/

const SummaryCard = ({
    icon,
    title,
    value,
    type = "",
}) => {

    return (

        <div
            className={`attendance-summary-card ${type}`}
        >

            <div className="attendance-summary-icon">

                {icon}

            </div>

            <div>

                <span>
                    {title}
                </span>

                <strong>
                    {value}
                </strong>

            </div>

        </div>
    );
};


export default AttendanceReport;