import "./Card.css";

import { useMemo } from "react";
import { useAttendance } from "../../../context/AttendenceContext";
import { useToast } from "../../../context/ToastContext";

const ClockCard = () => {

    const {
        attendance,
        markAttendance,
        checkOut,
    } = useAttendance();

    const { showToast } = useToast();

    // TODO: Replace with AuthContext
    const employeeId = "EMP001";

    const today = new Date().toISOString().split("T")[0];

    const todayRecord = useMemo(() => {

        return attendance.find(
            record =>
                record.employeeId === employeeId &&
                record.date === today
        );

    }, [attendance, employeeId, today]);

    const handleCheckIn = () => {

        if (todayRecord) {

            showToast(
                "warning",
                "Already Checked In",
                "You have already checked in today."
            );

            return;
        }

        markAttendance(employeeId);

        showToast(
            "success",
            "Checked In",
            "Attendance marked successfully."
        );

    };

    const handleCheckOut = () => {

        if (!todayRecord) {

            showToast(
                "error",
                "Check In Required",
                "Please check in first."
            );

            return;
        }

        if (todayRecord.checkOut) {

            showToast(
                "warning",
                "Already Checked Out",
                "You have already checked out."
            );

            return;
        }

        checkOut(employeeId);

        showToast(
            "success",
            "Checked Out",
            "Have a great day!"
        );

    };

    return (

        <div className="dashboard-card">

            <h3>Today's Attendance</h3>

            <div className="clock-time">

                {new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                })}

            </div>

            <div className="clock-info">

                <p>

                    Check In

                    <strong>

                        {todayRecord?.checkIn || "-- : --"}

                    </strong>

                </p>

                <p>

                    Check Out

                    <strong>

                        {todayRecord?.checkOut || "-- : --"}

                    </strong>

                </p>

            </div>

            <div className="clock-buttons">

                <button
                    className="checkin-btn"
                    onClick={handleCheckIn}
                    disabled={!!todayRecord}
                >

                    Check In

                </button>

                <button
                    className="checkout-btn"
                    onClick={handleCheckOut}
                    disabled={
                        !todayRecord ||
                        !!todayRecord?.checkOut
                    }
                >

                    Check Out

                </button>

            </div>

        </div>

    );

};

export default ClockCard;