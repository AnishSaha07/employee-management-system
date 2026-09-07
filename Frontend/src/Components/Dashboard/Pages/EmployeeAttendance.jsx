import { useEffect, useMemo } from "react";

import "./EmployeeAttendance.css";

import { useAttendance } from "../../../context/AttendenceContext";

import EmployeeAttendanceTable from "./EmployeeAttendanceTable";


const EmployeeAttendance = () => {

    const {
        attendance,
        loading,
        error,
        todayAttendance,
        fetchMyAttendance,
        checkIn,
        checkOut,
    } = useAttendance();


    /* ==========================================
                    LOAD ATTENDANCE
    ========================================== */

    useEffect(() => {

        fetchMyAttendance();

    }, [fetchMyAttendance]);


    /* ==========================================
                    SUMMARY
    ========================================== */

    const present = useMemo(
        () =>
            attendance.filter(
                record =>
                    record.status === "Present"
            ).length,
        [attendance]
    );


    const absent = useMemo(
        () =>
            attendance.filter(
                record =>
                    record.status === "Absent"
            ).length,
        [attendance]
    );


    const late = useMemo(
        () =>
            attendance.filter(
                record =>
                    record.status === "Late"
            ).length,
        [attendance]
    );


    /* ==========================================
                    CHECK IN
    ========================================== */

    const handleCheckIn = async () => {

        await checkIn("Present");

    };


    /* ==========================================
                    CHECK OUT
    ========================================== */

    const handleCheckOut = async () => {

        await checkOut();

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
                FORMAT WORKING HOURS
    ========================================== */

    const formatWorkingHours = (minutes) => {

        if (
            minutes === null ||
            minutes === undefined ||
            minutes === 0
        ) {
            return "--";
        }

        const hours =
            Math.floor(minutes / 60);

        const remainingMinutes =
            minutes % 60;


        if (hours === 0) {

            return `${remainingMinutes}m`;

        }


        return `${hours}h ${remainingMinutes}m`;

    };


    /* ==========================================
                    LOADING
    ========================================== */

    if (
        loading &&
        attendance.length === 0
    ) {

        return (

            <section className="employee-attendance">

                <div className="employee-page-header">

                    <div>

                        <h2>
                            My Attendance
                        </h2>

                        <p>
                            Track your attendance records.
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
                    PAGE
    ========================================== */

    return (

        <section className="employee-attendance">


            {/* =================================
                    HEADER
            ================================= */}

            <div className="employee-page-header">

                <div>

                    <h2>
                        My Attendance
                    </h2>

                    <p>
                        Track your attendance records.
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

            <div className="attendance-summary-grid">

                <div className="attendance-card">

                    <span>
                        Total Days
                    </span>

                    <h2>
                        {attendance.length}
                    </h2>

                </div>


                <div className="attendance-card">

                    <span>
                        Present
                    </span>

                    <h2>
                        {present}
                    </h2>

                </div>


                <div className="attendance-card">

                    <span>
                        Absent
                    </span>

                    <h2>
                        {absent}
                    </h2>

                </div>


                <div className="attendance-card">

                    <span>
                        Late
                    </span>

                    <h2>
                        {late}
                    </h2>

                </div>

            </div>


            {/* =================================
                TODAY'S ATTENDANCE
            ================================= */}

            <div className="today-attendance">

                <div className="today-header">

                    <h3>
                        Today's Attendance
                    </h3>


                    <div className="attendance-actions">

    {!todayAttendance && (
        <button
            type="button"
            onClick={handleCheckIn}
            disabled={loading}
            className="attendance-action-btn check-in-btn"
        >
            <span className="attendance-btn-icon">
                {loading ? "⌛" : "📍"}
            </span>

            <span className="attendance-btn-content">
                <strong>
                    {loading
                        ? "Verifying Location..."
                        : "Check In"
                    }
                </strong>

                <small>
                    {loading
                        ? "Checking your location"
                        : "Verify location & check in"
                    }
                </small>
            </span>
        </button>
    )}

    {todayAttendance &&
        !todayAttendance.checkOut && (
            <button
                type="button"
                onClick={handleCheckOut}
                disabled={loading}
                className="attendance-action-btn check-out-btn"
            >
                <span className="attendance-btn-icon">
                    {loading ? "⌛" : "🏁"}
                </span>

                <span className="attendance-btn-content">
                    <strong>
                        {loading
                            ? "Checking Out..."
                            : "Check Out"
                        }
                    </strong>

                    <small>
                        {loading
                            ? "Saving your attendance"
                            : "End today's work session"
                        }
                    </small>
                </span>
            </button>
        )}
                   </div>
                </div>


                {/* TODAY RECORD */}

                {todayAttendance ? (

                    <div className="today-card">


                        <p>

                            Status:

                            <strong>
                                {" "}
                                {todayAttendance.status}
                            </strong>

                        </p>


                        <p>

                            Check In:

                            <strong>
                                {" "}
                                {formatTime(
                                    todayAttendance.checkIn
                                )}
                            </strong>

                        </p>


                        <p>

                            Check Out:

                            <strong>
                                {" "}
                                {formatTime(
                                    todayAttendance.checkOut
                                )}
                            </strong>

                        </p>


                        <p>

                            Working Hours:

                            <strong>
                                {" "}
                                {formatWorkingHours(
                                    todayAttendance.workingMinutes
                                )}
                            </strong>

                        </p>


                    </div>

                ) : (

                    <p>
                        You have not checked in today.
                    </p>

                )}

            </div>


            {/* =================================
                    HISTORY
            ================================= */}

            <EmployeeAttendanceTable
                attendance={attendance}
            />

        </section>

    );

};


export default EmployeeAttendance;