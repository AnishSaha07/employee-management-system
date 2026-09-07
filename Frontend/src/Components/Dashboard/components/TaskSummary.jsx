import React from "react";

import "./TaskSummary.css";

import { useTask } from "../../../context/TaskContext";

import { FaCircle } from "react-icons/fa";

const TaskSummary = () => {

    const { tasks } = useTask();

    /* ===========================
            TASK COUNTS
    =========================== */

    const counts = {

        Pending: tasks.filter(
            task => task.status === "Pending"
        ).length,

        "In Progress": tasks.filter(
            task => task.status === "In Progress"
        ).length,

        Completed: tasks.filter(
            task => task.status === "Completed"
        ).length,

        Failed: tasks.filter(
            task => task.status === "Failed"
        ).length,

    };

    const total = tasks.length;


    /* ===========================
            STATUS DATA
    =========================== */

    const statuses = [

        {
            label: "Pending",
            color: "#f59e0b",
            count: counts.Pending,
        },

        {
            label: "In Progress",
            color: "#3b82f6",
            count: counts["In Progress"],
        },

        {
            label: "Completed",
            color: "#10b981",
            count: counts.Completed,
        },

        {
            label: "Failed",
            color: "#ef4444",
            count: counts.Failed,
        },

    ];


    /* ===========================
            DONUT
    =========================== */

    const r = 52;

    const cx = 70;

    const cy = 70;

    const circumference =
        2 * Math.PI * r;

    let cumulativePct = 0;

    const segments = statuses.map((status) => {

        const pct = total
            ? (status.count / total) * 100
            : 0;

        const segment = {

            ...status,

            pct,

            start: cumulativePct,

        };

        cumulativePct += pct;

        return segment;

    });


    return (

        <div className="task-summary">

            {/* HEADER */}

            <div className="box-header">

                <h3>

                    Task Summary

                </h3>

                <span className="badge-count">

                    {total} {total === 1 ? "Task" : "Tasks"}

                </span>

            </div>


            {/* CONTENT */}

            <div className="task-donut-wrap">

                <svg
                    viewBox="0 0 140 140"
                    className="donut-svg"
                >

                    {/* Empty donut background */}

                    <circle

                        cx={cx}

                        cy={cy}

                        r={r}

                        fill="none"

                        stroke="#292929"

                        strokeWidth="18"

                    />


                    {/* Task segments */}

                    {segments.map((segment, index) => (

                        segment.pct > 0 && (

                            <circle

                                key={index}

                                cx={cx}

                                cy={cy}

                                r={r}

                                fill="none"

                                stroke={segment.color}

                                strokeWidth="18"

                                strokeDasharray={`${
                                    (segment.pct / 100) *
                                    circumference
                                } ${circumference}`}

                                strokeDashoffset={
                                    -(
                                        (segment.start / 100) *
                                        circumference
                                    )
                                }

                                transform={`rotate(-90 ${cx} ${cy})`}

                                style={{
                                    transition:
                                        "stroke-dasharray .5s ease",
                                }}

                            />

                        )

                    ))}


                    {/* TOTAL */}

                    <text

                        x={cx}

                        y={cy - 6}

                        textAnchor="middle"

                        fill="#fff"

                        fontSize="20"

                        fontWeight="700"

                    >

                        {total}

                    </text>


                    <text

                        x={cx}

                        y={cy + 12}

                        textAnchor="middle"

                        fill="#9ca3af"

                        fontSize="10"

                    >

                        Total

                    </text>

                </svg>


                {/* LEGEND */}

                <div className="task-legend">

                    {statuses.map((status) => (

                        <div
                            key={status.label}
                            className="legend-row"
                        >

                            <FaCircle
                                style={{
                                    color: status.color,
                                    fontSize: 9,
                                }}
                            />

                            <span className="legend-label">

                                {status.label}

                            </span>

                            <span className="legend-count">

                                {status.count}

                            </span>

                        </div>

                    ))}

                </div>

            </div>

        </div>

    );

};

export default TaskSummary;