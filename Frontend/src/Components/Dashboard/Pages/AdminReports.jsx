import { useState } from "react";

import "./AdminReports.css";
import AttendanceReport from "./AttendanceReport";
import PayrollReport from "./PayrollReport";

import {
    FaUsers,
    FaCalendarCheck,
    FaMoneyBillWave,
    FaUmbrellaBeach,
    FaTasks,
    FaUserCircle,
} from "react-icons/fa";

import EmployeeInformationReport from "./EmployeeInformationReport";

const AdminReports = ({ onClose }) => {

    const [activeReport, setActiveReport] = useState("employees");

    const reports = [
        {
            id: "employees",
            title: "Employee Information",
            description:
                "View complete employee profile, employment, bank and salary information.",
            icon: <FaUsers />,
            color: "blue",
        },

        {
            id: "attendance",
            title: "Attendance Report",
            description:
                "View employee attendance, check-in, check-out and working hours.",
            icon: <FaCalendarCheck />,
            color: "green",
        },

        {
            id: "payroll",
            title: "Payroll Report",
            description:
                "View salary, allowances, deductions and payroll history.",
            icon: <FaMoneyBillWave />,
            color: "purple",
        },

        {
            id: "leave",
            title: "Leave Report",
            description:
                "View employee leave requests and approval history.",
            icon: <FaUmbrellaBeach />,
            color: "orange",
        },

        {
            id: "tasks",
            title: "Task Report",
            description:
                "View assigned tasks and employee task progress.",
            icon: <FaTasks />,
            color: "cyan",
        },
    ];

    return (

        <section className="admin-reports">

            {/* HEADER */}

            <div className="admin-reports-header">

                <div>

                    <h2>
                        Reports
                    </h2>

                    <p>
                        View and manage organization reports.
                    </p>

                </div>

                {onClose && (

                    <button
                        type="button"
                        className="reports-close-btn"
                        onClick={onClose}
                    >

                        <span>×</span>

                        Close

                    </button>

                )}

            </div>


            {/* REPORT CARDS */}

            <div className="reports-selector">

                {reports.map((report) => (

                    <button
                        key={report.id}
                        type="button"
                        className={`report-selector-card ${
                            activeReport === report.id
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            setActiveReport(report.id)
                        }
                    >

                        <div
                            className={`report-selector-icon ${report.color}`}
                        >

                            {report.icon}

                        </div>

                        <div className="report-selector-content">

                            <h3>
                                {report.title}
                            </h3>

                            <p>
                                {report.description}
                            </p>

                        </div>

                    </button>

                ))}

            </div>


            {/* REPORT CONTENT */}

            <div className="report-content">

               {activeReport === "employees" && (
    <EmployeeInformationReport />
)}

{activeReport === "attendance" && (
    <AttendanceReport />
)}

{activeReport === "payroll" && (
    <PayrollReport />
)}

{activeReport !== "employees" &&
    activeReport !== "attendance" && 
     activeReport !== "payroll" && (
        <div className="report-coming-soon">
            <FaUserCircle />

            <h3>
                {
                    reports.find(
                        (report) =>
                            report.id ===
                            activeReport
                    )?.title
                }
            </h3>

            <p>
                This report module will be
                connected to the existing system
                data next.
            </p>
        </div>
    )}

            </div>

        </section>

    );

};

export default AdminReports;