import "./EmployeeLeaveTable.css";

import { FaEye } from "react-icons/fa";


const EmployeeLeaveTable = ({
    leaves = [],
    onView,
}) => {


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
                    STATUS CLASS
    ========================================== */

    const getStatusClass = (status) => {

        return (
            status
                ?.toLowerCase()
                .replace(/\s+/g, "-") ||
            "pending"
        );

    };


    return (

        <div className="employee-leave-table-card">

            <table className="employee-leave-table">

                <thead>

                    <tr>

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
                            Applied On
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

                    {leaves.length === 0 ? (

                        <tr>

                            <td
                                colSpan="6"
                                className="empty-row"
                            >

                                No Leave Requests Found

                            </td>

                        </tr>

                    ) : (

                        leaves.map((leave) => (

                            <tr
                                key={
                                    leave._id ||
                                    leave.id
                                }
                            >

                                <td>

                                    {leave.leaveType ||
                                        "--"}

                                </td>


                                <td>

                                    {formatDate(
                                        leave.fromDate
                                    )}

                                </td>


                                <td>

                                    {formatDate(
                                        leave.toDate
                                    )}

                                </td>


                                <td>

                                    {formatDate(
                                        leave.createdAt ||
                                        leave.appliedAt
                                    )}

                                </td>


                                <td>

                                    <span
                                        className={`status ${getStatusClass(
                                            leave.status
                                        )}`}
                                    >

                                        {leave.status ||
                                            "Pending"}

                                    </span>

                                </td>


                                <td>

                                    <button
                                        type="button"
                                        className="view-btn"
                                        onClick={() =>
                                            onView(
                                                leave
                                            )
                                        }
                                    >

                                        <FaEye />

                                    </button>

                                </td>

                            </tr>

                        ))

                    )}

                </tbody>

            </table>

        </div>

    );

};


export default EmployeeLeaveTable;