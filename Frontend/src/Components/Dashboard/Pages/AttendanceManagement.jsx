import {
    useEffect,
    useMemo,
    useState,
} from "react";

import "./AttendanceManagement.css";

import {
    FaSearch,
    FaMapMarkerAlt,
    FaSignInAlt,
    FaSignOutAlt,
    FaSyncAlt,
} from "react-icons/fa";

import { useEmployees } from "../../../context/EmployeeContext";

import {
    useAttendance,
} from "../../../context/AttendenceContext";

import { useLeave } from "../../../context/LeaveContext";

import AttendanceTable from "./AttendanceTable";


const AttendanceManagement = () => {

    const { employees } = useEmployees();

    const {
        adminAttendance,
        fetchTodayAttendance,
        loading,
        error,
        todayAttendance,
        checkIn,
        checkOut,
    } = useAttendance();

    const {
        getEmployeesOnLeaveToday,
    } = useLeave();


    /* ==========================================
                    FILTER STATES
    ========================================== */

    const [search, setSearch] = useState("");

    const [department, setDepartment] =
        useState("");

    const [status, setStatus] =
        useState("");

    const [actionMessage, setActionMessage] =
        useState("");

    const [actionError, setActionError] =
        useState("");


    /* ==========================================
                LOAD TODAY ATTENDANCE
    ========================================== */

    useEffect(() => {

        fetchTodayAttendance();

    }, [fetchTodayAttendance]);


    /* ==========================================
                    TODAY DATE
    ========================================== */

    const today = useMemo(() => {

        return new Date()
            .toISOString()
            .split("T")[0];

    }, []);


    /* ==========================================
                TODAY RECORDS
    ========================================== */

    const todayRecords = useMemo(() => {

        return adminAttendance.filter((record) => {

            const recordDate =
                typeof record.date === "string"
                    ? record.date.split("T")[0]
                    : record.date;

            return recordDate === today;

        });

    }, [adminAttendance, today]);


    /* ==========================================
                    ADMIN RECORD
    ========================================== */

    const adminRecord = useMemo(() => {

        const adminEmployee =
            employees.find(
                (employee) =>
                    employee.role === "admin"
            );

        if (!adminEmployee) {
            return todayAttendance || null;
        }

        return (
            todayRecords.find(
                (record) =>
                    record.employeeId ===
                    adminEmployee.employeeId
            ) ||
            todayAttendance ||
            null
        );

    }, [
        employees,
        todayRecords,
        todayAttendance,
    ]);


    /* ==========================================
                    SUMMARY
    ========================================== */

    const presentCount = useMemo(() => {

        return todayRecords.filter(
            (record) =>
                record.status === "Present"
        ).length;

    }, [todayRecords]);


    const absentCount = useMemo(() => {

        return todayRecords.filter(
            (record) =>
                record.status === "Absent"
        ).length;

    }, [todayRecords]);


    const lateCount = useMemo(() => {

        return todayRecords.filter(
            (record) =>
                record.status === "Late"
        ).length;

    }, [todayRecords]);


    const onLeaveCount =
        typeof getEmployeesOnLeaveToday === "function"
            ? getEmployeesOnLeaveToday().length
            : 0;


    /* ==========================================
                    DEPARTMENTS
    ========================================== */

    const departments = useMemo(() => {

        return [
            ...new Set(
                employees
                    .map(
                        (employee) =>
                            employee.department
                    )
                    .filter(Boolean)
            ),
        ];

    }, [employees]);


    /* ==========================================
                FILTER EMPLOYEES
    ========================================== */

    const filteredEmployees = useMemo(() => {

        return employees.filter((employee) => {

            const searchValue =
                search.trim().toLowerCase();


            const matchesSearch =
                !searchValue ||
                employee.name
                    ?.toLowerCase()
                    .includes(searchValue) ||
                employee.employeeId
                    ?.toLowerCase()
                    .includes(searchValue) ||
                employee.email
                    ?.toLowerCase()
                    .includes(searchValue);


            const matchesDepartment =
                !department ||
                employee.department ===
                    department;


            if (
                !matchesSearch ||
                !matchesDepartment
            ) {
                return false;
            }


            if (!status) {
                return true;
            }


            const employeeRecord =
                todayRecords.find(
                    (record) =>
                        record.employeeId ===
                        employee.employeeId
                );


            const employeeStatus =
                employeeRecord?.status ||
                "Not Marked";


            return employeeStatus === status;

        });

    }, [
        employees,
        search,
        department,
        status,
        todayRecords,
    ]);


    /* ==========================================
                    ADMIN CHECK IN
    ========================================== */

    const handleAdminCheckIn = async () => {

        setActionMessage("");
        setActionError("");

        const result =
            await checkIn("Present");

        if (result.success) {

            setActionMessage(
                "Admin check-in successful. Your location was verified."
            );

            await fetchTodayAttendance();

        } else {

            setActionError(
                result.message ||
                "Unable to check in."
            );

        }

    };


    /* ==========================================
                    ADMIN CHECK OUT
    ========================================== */

    const handleAdminCheckOut = async () => {

        setActionMessage("");
        setActionError("");

        const result =
            await checkOut();

        if (result.success) {

            setActionMessage(
                "Admin check-out successful. Your location was verified."
            );

            await fetchTodayAttendance();

        } else {

            setActionError(
                result.message ||
                "Unable to check out."
            );

        }

    };


    /* ==========================================
                    REFRESH
    ========================================== */

    const handleRefresh = async () => {

        setActionMessage("");
        setActionError("");

        await fetchTodayAttendance();

    };


    /* ==========================================
                    FORMAT TIME
    ========================================== */

    const formatTime = (value) => {

        if (!value) {
            return "--";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });

    };


    /* ==========================================
                    INITIAL LOADING
    ========================================== */

    if (
        loading &&
        adminAttendance.length === 0
    ) {

        return (

            <section className="attendance-management">

                <div className="attendance-header">

                    <div>

                        <h2>
                            Attendance Management
                        </h2>

                        <p>
                            Track and manage employee attendance.
                        </p>

                    </div>

                </div>

                <p>
                    Loading attendance...
                </p>

            </section>

        );

    }


    /* ==========================================
                    UI
    ========================================== */

    return (

        <section className="attendance-management">


            {/* =================================
                        HEADER
            ================================= */}

            <div className="attendance-header">

                <div>

                    <h2>
                        Attendance Management
                    </h2>

                    <p>
                        Track and manage employee attendance.
                    </p>

                </div>


                <button
                    type="button"
                    className="attendance-refresh-btn"
                    onClick={handleRefresh}
                    disabled={loading}
                >

                    <FaSyncAlt />

                    {loading
                        ? "Refreshing..."
                        : "Refresh"
                    }

                </button>

            </div>


            {/* =================================
                    ADMIN SELF ATTENDANCE
            ================================= */}

            <div className="admin-self-attendance">

                <div className="admin-self-attendance-info">

                    <div className="admin-location-icon">

                        <FaMapMarkerAlt />

                    </div>

                    <div>

                        <h3>
                            My Attendance
                        </h3>

                        <p>
                            Your attendance is verified using
                            the company's configured office location.
                        </p>

                    </div>

                </div>


                <div className="admin-self-attendance-status">

                    <div className="admin-today-status">

                        <span>
                            Today's Status
                        </span>

                        <strong>

                            {adminRecord?.status ||
                                "Not Marked"}

                        </strong>

                    </div>


                    <div className="admin-today-time">

                        <span>
                            Check In
                        </span>

                        <strong>

                            {formatTime(
                                adminRecord?.checkIn
                            )}

                        </strong>

                    </div>


                    <div className="admin-today-time">

                        <span>
                            Check Out
                        </span>

                        <strong>

                            {formatTime(
                                adminRecord?.checkOut
                            )}

                        </strong>

                    </div>


                    <div className="admin-attendance-buttons">

                        {!adminRecord && (

                            <button
                                type="button"
                                className="admin-check-in-btn"
                                onClick={
                                    handleAdminCheckIn
                                }
                                disabled={loading}
                            >

                                <FaSignInAlt />

                                {loading
                                    ? "Checking..."
                                    : "Check In"
                                }

                            </button>

                        )}


                        {adminRecord &&
                            !adminRecord.checkOut && (

                                <button
                                    type="button"
                                    className="admin-check-out-btn"
                                    onClick={
                                        handleAdminCheckOut
                                    }
                                    disabled={loading}
                                >

                                    <FaSignOutAlt />

                                    {loading
                                        ? "Checking..."
                                        : "Check Out"
                                    }

                                </button>

                            )}


                        {adminRecord?.checkOut && (

                            <span className="admin-attendance-completed">

                                ✓ Attendance Completed

                            </span>

                        )}

                    </div>

                </div>

            </div>


            {/* =================================
                        ACTION MESSAGE
            ================================= */}

            {actionMessage && (

                <div className="attendance-success-message">

                    {actionMessage}

                </div>

            )}


            {actionError && (

                <div className="attendance-error-message">

                    {actionError}

                </div>

            )}


            {/* =================================
                        API ERROR
            ================================= */}

            {error && !actionError && (

                <div className="error-box">

                    {error}

                </div>

            )}


            {/* =================================
                        SUMMARY
            ================================= */}

            <div className="attendance-summary">

                <div className="summary-box">

                    <h4>
                        Present
                    </h4>

                    <h2>
                        {presentCount}
                    </h2>

                </div>


                <div className="summary-box">

                    <h4>
                        Absent
                    </h4>

                    <h2>
                        {absentCount}
                    </h2>

                </div>


                <div className="summary-box">

                    <h4>
                        Late
                    </h4>

                    <h2>
                        {lateCount}
                    </h2>

                </div>


                <div className="summary-box">

                    <h4>
                        On Leave
                    </h4>

                    <h2>
                        {onLeaveCount}
                    </h2>

                </div>

            </div>


            {/* =================================
                        TOOLBAR
            ================================= */}

            <div className="attendance-toolbar">


                <div className="search-box">

                    <FaSearch />

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

                </div>


                <select
                    value={department}
                    onChange={(e) =>
                        setDepartment(
                            e.target.value
                        )
                    }
                >

                    <option value="">
                        All Departments
                    </option>

                    {departments.map(
                        (departmentName) => (

                            <option
                                key={departmentName}
                                value={departmentName}
                            >
                                {departmentName}
                            </option>

                        )
                    )}

                </select>


                <select
                    value={status}
                    onChange={(e) =>
                        setStatus(
                            e.target.value
                        )
                    }
                >

                    <option value="">
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

                    <option value="On Leave">
                        On Leave
                    </option>

                    <option value="Not Marked">
                        Not Marked
                    </option>

                </select>

            </div>


            {/* =================================
                    ATTENDANCE TABLE
            ================================= */}

            <AttendanceTable
                employees={filteredEmployees}
                attendance={todayRecords}
            />

        </section>

    );

};


export default AttendanceManagement;