import "./Card.css";

import { useMemo } from "react";

import { useAttendance } from "../../../context/AttendenceContext";


const AttendanceSummaryCard = () => {

    const {
        attendance = [],
    } = useAttendance();


    const stats = useMemo(() => {

        const records =
            Array.isArray(attendance)
                ? attendance
                : [];


        const present =
            records.filter(
                (record) =>
                    record.status ===
                    "Present"
            ).length;


        const absent =
            records.filter(
                (record) =>
                    record.status ===
                    "Absent"
            ).length;


        const late =
            records.filter(
                (record) =>
                    record.status ===
                    "Late"
            ).length;


        const total =
            records.length;


        const percentage =
            total === 0
                ? 0
                : Math.round(
                      ((present + late) /
                          total) *
                          100
                  );


        return {
            present,
            absent,
            late,
            percentage,
        };

    }, [attendance]);


    return (

        <div className="dashboard-card">

            <h3>
                Attendance Summary
            </h3>


            <div className="attendance-stats">

                <div>

                    <span>
                        Present
                    </span>

                    <strong>
                        {stats.present}
                    </strong>

                </div>


                <div>

                    <span>
                        Absent
                    </span>

                    <strong>
                        {stats.absent}
                    </strong>

                </div>


                <div>

                    <span>
                        Late
                    </span>

                    <strong>
                        {stats.late}
                    </strong>

                </div>

            </div>


            <div className="attendance-progress">

                <div
                    className="progress-fill"
                    style={{
                        width:
                            `${stats.percentage}%`,
                    }}
                />

            </div>


            <p className="card-subtitle">

                Attendance:{" "}
                {stats.percentage}%

            </p>

        </div>

    );
};


export default AttendanceSummaryCard;