import "./AttendanceTable.css";

import {
    FaMapMarkerAlt,
} from "react-icons/fa";


const AttendanceTable = ({
    employees = [],
    attendance = [],
}) => {


    /* ==========================================
                    FIND RECORD
    ========================================== */

    const getRecord = (employeeId) => {

        return attendance.find(
            (record) =>
                record.employeeId ===
                employeeId
        );

    };


    /* ==========================================
                    FORMAT TIME
    ========================================== */

    const formatTime = (value) => {

        if (!value || value === "--") {
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
            minutes === undefined
        ) {
            return "--";
        }

        if (minutes === 0) {
            return "0m";
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
                LOCATION STATUS
    ========================================== */

    const getLocationStatus = (record) => {

        if (
            record?.checkInLocation
        ) {

            return {
                verified: true,
                distance:
                    record
                        .checkInLocation
                        .distanceFromOffice,
            };

        }

        return {
            verified: false,
            distance: null,
        };

    };


    return (

        <div className="attendance-table-card">

            <table className="attendance-table">

                <thead>

                    <tr>

                        <th>
                            Employee
                        </th>

                        <th>
                            Department
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

                        <th>
                            Location
                        </th>

                    </tr>

                </thead>


                <tbody>

                    {employees.length === 0 ? (

                        <tr>

                            <td
                                colSpan="7"
                                style={{
                                    textAlign:
                                        "center",
                                    padding:
                                        "30px",
                                }}
                            >

                                No employees found.

                            </td>

                        </tr>

                    ) : (

                        employees.map(
                            (employee) => {

                                const record =
                                    getRecord(
                                        employee.employeeId
                                    );

                                const location =
                                    getLocationStatus(
                                        record
                                    );


                                return (

                                    <tr
                                        key={
                                            employee._id ||
                                            employee.id ||
                                            employee.employeeId
                                        }
                                    >


                                        {/* EMPLOYEE */}

                                        <td>

                                            <div className="employee-info">

                                                <div className="employee-avatar">

                                                    {employee.name
                                                        ?.split(" ")
                                                        .map(
                                                            (word) =>
                                                                word[0]
                                                        )
                                                        .join("")
                                                        .toUpperCase()}

                                                </div>


                                                <div>

                                                    <h4>
                                                        {employee.name}
                                                    </h4>

                                                    <span>
                                                        {
                                                            employee.employeeId
                                                        }
                                                    </span>

                                                </div>

                                            </div>

                                        </td>


                                        {/* DEPARTMENT */}

                                        <td>

                                            {
                                                employee.department ||
                                                "--"
                                            }

                                        </td>


                                        {/* CHECK IN */}

                                        <td>

                                            {formatTime(
                                                record?.checkIn
                                            )}

                                        </td>


                                        {/* CHECK OUT */}

                                        <td>

                                            {formatTime(
                                                record?.checkOut
                                            )}

                                        </td>


                                        {/* WORKING HOURS */}

                                        <td>

                                            {formatWorkingHours(
                                                record?.workingMinutes
                                            )}

                                        </td>


                                        {/* STATUS */}

                                        <td>

                                            <span
                                                className={`status ${
                                                    record?.status
                                                        ?.toLowerCase()
                                                        .replace(
                                                            " ",
                                                            "-"
                                                        ) ||
                                                    "not-marked"
                                                }`}
                                            >

                                                {
                                                    record?.status ||
                                                    "Not Marked"
                                                }

                                            </span>

                                        </td>


                                        {/* LOCATION */}

                                        <td>

                                            {location.verified ? (

                                                <div className="attendance-location">

                                                    <span className="location-verified">

                                                        <FaMapMarkerAlt />

                                                        Verified

                                                    </span>


                                                    {location.distance !== null && (

                                                        <small>

                                                            {
                                                                location.distance
                                                            }{" "}
                                                            m from office

                                                        </small>

                                                    )}

                                                </div>

                                            ) : (

                                                <span className="location-not-verified">

                                                    —

                                                </span>

                                            )}

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


export default AttendanceTable;