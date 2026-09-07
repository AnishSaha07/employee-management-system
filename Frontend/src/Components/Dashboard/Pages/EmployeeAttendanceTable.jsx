import "./EmployeeAttendanceTable.css";


const EmployeeAttendanceTable = ({
    attendance = [],
}) => {


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
                    FORMAT DATE
    ========================================== */

    const formatDate = (value) => {

        if (!value) {
            return "--";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });

    };


    /* ==========================================
                WORKING HOURS
    ========================================== */

    const formatWorkingHours = (minutes) => {

        if (
            minutes === null ||
            minutes === undefined
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


    return (

        <div className="employee-attendance-table-card">

            <table className="employee-attendance-table">

                <thead>

                    <tr>

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

                    {attendance.length === 0 ? (

                        <tr>

                            <td
                                colSpan="5"
                                className="empty-row"
                            >

                                No Attendance Found

                            </td>

                        </tr>

                    ) : (

                        attendance.map(record => (

                            <tr
                                key={
                                    record._id ||
                                    record.id
                                }
                            >

                                <td>

                                    {formatDate(
                                        record.date
                                    )}

                                </td>


                                <td>

                                    {formatTime(
                                        record.checkIn
                                    )}

                                </td>


                                <td>

                                    {formatTime(
                                        record.checkOut
                                    )}

                                </td>


                                <td>

                                    {formatWorkingHours(
                                        record.workingMinutes
                                    )}

                                </td>


                                <td>

                                    <span
                                        className={`status ${
                                            record.status
                                                ?.toLowerCase()
                                                .replace(
                                                    /\s+/g,
                                                    "-"
                                                )
                                        }`}
                                    >

                                        {record.status}

                                    </span>

                                </td>

                            </tr>

                        ))

                    )}

                </tbody>

            </table>

        </div>

    );

};


export default EmployeeAttendanceTable;