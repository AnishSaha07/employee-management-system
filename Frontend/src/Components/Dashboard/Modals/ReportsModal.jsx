import { useMemo, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import "./ReportsModal.css";

import Modal from "../../../common/Modal";

import { useEmployees } from "../../../context/EmployeeContext";
import { useAttendance } from "../../../context/AttendenceContext";
import { useLeave } from "../../../context/LeaveContext";
import { useTask } from "../../../context/TaskContext";

import {
    FaUsers,
    FaCalendarAlt,
    FaClipboardList,
    FaMoneyBillWave,
    FaTasks,
    FaArrowLeft,
    FaEye,
    FaUser,
    FaBriefcase,
    FaUniversity,
    FaWallet,
    FaClock,
    FaFilePdf,
} from "react-icons/fa";

const ReportsModal = ({ open, onClose }) => {

    const { employees } = useEmployees();

    const { attendance } = useAttendance();

    const { leaveRequests } = useLeave();

    const { tasks } = useTask();


    /* ===============================
            NORMALIZED DATA
    =============================== */

    const attendanceRecords = useMemo(() => {

        if (Array.isArray(attendance)) return attendance;
        if (Array.isArray(attendance?.records)) return attendance.records;
        if (Array.isArray(attendance?.attendance)) return attendance.attendance;
        if (Array.isArray(attendance?.data)) return attendance.data;

        return [];

    }, [attendance]);


    const leaveRecords = useMemo(() => (
        Array.isArray(leaveRequests) ? leaveRequests : []
    ), [leaveRequests]);


    const taskRecords = useMemo(() => (
        Array.isArray(tasks) ? tasks : []
    ), [tasks]);


    const [selectedReport, setSelectedReport] =
        useState(null);

    const [selectedEmployee, setSelectedEmployee] =
        useState(null);


    /* ===============================
            CLOSE
    =============================== */

    const handleClose = () => {

        setSelectedReport(null);
        setSelectedEmployee(null);

        onClose();

    };


    /* ===============================
            BACK
    =============================== */

    const goBack = () => {

        if (selectedEmployee) {

            setSelectedEmployee(null);

            return;

        }

        setSelectedReport(null);

    };


    /* ===============================
            REPORTS
    =============================== */

    const reports = [

        {
            id: "employees",
            title: "Employee Report",
            icon: <FaUsers />,
            description:
                "View complete employee information, profile, job, bank and payroll details.",
        },

        {
            id: "attendance",
            title: "Attendance Report",
            icon: <FaCalendarAlt />,
            description:
                "View employee attendance, check-in, check-out and working hours.",
        },

        {
            id: "leave",
            title: "Leave Report",
            icon: <FaClipboardList />,
            description:
                "View employee leave requests, dates, reasons and approval status.",
        },

        {
            id: "payroll",
            title: "Payroll Report",
            icon: <FaMoneyBillWave />,
            description:
                "View generated salaries, allowances, deductions and net salary.",
        },

        {
            id: "tasks",
            title: "Task Report",
            icon: <FaTasks />,
            description:
                "View assigned tasks and their current progress and status.",
        },

    ];


    /* ===============================
            ATTENDANCE STATS
    =============================== */

    const attendanceStats = useMemo(() => {

        const records = attendanceRecords;

        return {
            total: records.length,

            present: records.filter(
                item => String(item?.status || "").toLowerCase() === "present"
            ).length,

            absent: records.filter(
                item => String(item?.status || "").toLowerCase() === "absent"
            ).length,

            late: records.filter(
                item => String(item?.status || "").toLowerCase() === "late"
            ).length,
        };

    }, [attendanceRecords]);


    /* ===============================
            LEAVE STATS
    =============================== */

    const leaveStats = useMemo(() => {

        const records = leaveRecords;

        return {

            total: records.length,

            pending:
                records.filter(
                    item =>
                        (item.status || "").toLowerCase() ===
                        "pending"
                ).length,

            approved:
                records.filter(
                    item =>
                        (item.status || "").toLowerCase() ===
                        "approved"
                ).length,

            rejected:
                records.filter(
                    item =>
                        (item.status || "").toLowerCase() ===
                        "rejected"
                ).length,

        };

    }, [leaveRecords]);


    /* ===============================
            TASK STATS
    =============================== */

    const taskStats = useMemo(() => {

        const records = taskRecords;

        return {

            total: records.length,

            pending:
                records.filter(
                    task =>
                        (task.status || "Pending") ===
                        "Pending"
                ).length,

            progress:
                records.filter(
                    task =>
                        (task.status || "") ===
                        "In Progress"
                ).length,

            completed:
                records.filter(
                    task =>
                        (task.status || "") ===
                        "Completed"
                ).length,

            failed:
                records.filter(
                    task =>
                        (task.status || "") ===
                        "Failed"
                ).length,

        };

    }, [taskRecords]);


    /* ===============================
            PAYROLL STATS
    =============================== */

    const payrollStats = useMemo(() => {

        let generated = 0;

        let totalNetSalary = 0;

        (employees || []).forEach(employee => {

            const history =
                employee.payrollHistory || [];

            generated += history.length;

            history.forEach(payroll => {

                totalNetSalary +=
                    Number(payroll.netSalary) || 0;

            });

        });

        return {
            generated,
            totalNetSalary,
        };

    }, [employees]);


    /* ===============================
            PDF EXPORT HELPERS
    =============================== */

    const createPdf = (title, subtitle) => {

        const doc = new jsPDF("landscape", "mm", "a4");

        doc.setFillColor(20, 20, 20);
        doc.rect(0, 0, 297, 30, "F");

        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.text(title, 14, 13);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text(subtitle, 14, 20);
        doc.text(
            `Generated: ${new Date().toLocaleString("en-IN")}`,
            14,
            26
        );

        return doc;
    };

    const finishPdf = (doc, filename) => {

        const pageCount = doc.internal.getNumberOfPages();

        for (let page = 1; page <= pageCount; page += 1) {

            doc.setPage(page);
            doc.setFontSize(8);
            doc.setTextColor(120, 120, 120);
            doc.text(
                `Page ${page} of ${pageCount}`,
                283,
                202,
                { align: "right" }
            );
        }

        doc.save(filename);
    };

    const exportAttendancePDF = () => {

        const records = attendanceRecords;

        const doc = createPdf(
            "Attendance Report",
            "Organization-wide employee attendance records"
        );

        autoTable(doc, {
            startY: 36,
            head: [[
                "Employee",
                "Employee ID",
                "Date",
                "Check In",
                "Check Out",
                "Working Hours",
                "Status",
            ]],
            body: records.map(record => {
                const employee = employees.find(
                    e => e.employeeId === record.employeeId
                );

                return [
                    employee?.name || record.employeeId || "--",
                    record.employeeId || "--",
                    record.date || "--",
                    record.checkIn || "--",
                    record.checkOut || "--",
                    record.workingHours || "--",
                    record.status || "Unknown",
                ];
            }),
            theme: "grid",
            styles: { fontSize: 8, cellPadding: 3 },
            headStyles: { fillColor: [37, 99, 235], textColor: 255 },
        });

        finishPdf(doc, `Attendance_Report_${Date.now()}.pdf`);
    };

    const exportLeavePDF = () => {

        const records = leaveRequests || [];

        const doc = createPdf(
            "Leave Report",
            "Employee leave requests and approval history"
        );

        autoTable(doc, {
            startY: 36,
            head: [[
                "Employee",
                "Employee ID",
                "Leave Type",
                "From",
                "To",
                "Reason",
                "Status",
            ]],
            body: records.map(leave => [
                leave.employeeName || "--",
                leave.employeeId || "--",
                leave.leaveType || "--",
                leave.fromDate || "--",
                leave.toDate || "--",
                leave.reason || "--",
                leave.status || "Pending",
            ]),
            theme: "grid",
            styles: { fontSize: 8, cellPadding: 3 },
            headStyles: { fillColor: [37, 99, 235], textColor: 255 },
        });

        finishPdf(doc, `Leave_Report_${Date.now()}.pdf`);
    };

    const exportPayrollPDF = () => {

        const doc = createPdf(
            "Payroll Report",
            "Generated payroll records for all employees"
        );

        const rows = [];

        (employees || []).forEach(employee => {

            (employee.payrollHistory || []).forEach(payroll => {

                rows.push([
                    employee.name || "--",
                    employee.employeeId || "--",
                    payroll.month || "--",
                    `₹${Number(payroll.basic || 0).toLocaleString("en-IN")}`,
                    `₹${Number(payroll.allowance || 0).toLocaleString("en-IN")}`,
                    `₹${Number(payroll.deduction || 0).toLocaleString("en-IN")}`,
                    `₹${Number(payroll.netSalary || 0).toLocaleString("en-IN")}`,
                    payroll.status || "Generated",
                ]);
            });
        });

        autoTable(doc, {
            startY: 36,
            head: [[
                "Employee",
                "Employee ID",
                "Month",
                "Basic",
                "Allowances",
                "Deductions",
                "Net Salary",
                "Status",
            ]],
            body: rows,
            theme: "grid",
            styles: { fontSize: 8, cellPadding: 3 },
            headStyles: { fillColor: [37, 99, 235], textColor: 255 },
        });

        finishPdf(doc, `Payroll_Report_${Date.now()}.pdf`);
    };

    const exportTaskPDF = () => {

        const records = tasks || [];

        const doc = createPdf(
            "Task Report",
            "Organization-wide employee task progress"
        );

        autoTable(doc, {
            startY: 36,
            head: [[
                "Employee",
                "Task",
                "Priority",
                "Due Date",
                "Status",
                "Updated",
            ]],
            body: records.map(task => [
                task.employeeName || task.employeeId || "--",
                task.title || "--",
                task.priority || "Normal",
                task.dueDate || "--",
                task.status || "Pending",
                task.updatedAt || task.createdAt || "--",
            ]),
            theme: "grid",
            styles: { fontSize: 8, cellPadding: 3 },
            headStyles: { fillColor: [37, 99, 235], textColor: 255 },
        });

        finishPdf(doc, `Task_Report_${Date.now()}.pdf`);
    };

    /* ===============================
        EMPLOYEE ATTENDANCE
    =============================== */

    const getEmployeeAttendance = (employeeId) => {

        return attendanceRecords.filter(
            record =>
                record.employeeId === employeeId
        );

    };


    /* ===============================
        EMPLOYEE LEAVES
    =============================== */

    const getEmployeeLeaves = (employeeId) => {

        return leaveRecords.filter(
            leave =>
                leave.employeeId === employeeId
        );

    };


    /* ===============================
        EMPLOYEE TASKS
    =============================== */

    const getEmployeeTasks = (employeeId) => {

        return taskRecords.filter(
            task =>
                task.employeeId === employeeId
        );

    };


    /* ===============================
        EMPLOYEE FULL REPORT
    =============================== */

    const renderEmployeeFullReport = () => {

        if (!selectedEmployee) return null;

        const employee =
            selectedEmployee;

        const employeeAttendance =
            getEmployeeAttendance(
                employee.employeeId
            );

        const employeeLeaves =
            getEmployeeLeaves(
                employee.employeeId
            );

        const employeeTasks =
            getEmployeeTasks(
                employee.employeeId
            );

        const payrollHistory =
            employee.payrollHistory || [];

        const latestPayroll =
            payrollHistory.length > 0
                ? payrollHistory[payrollHistory.length - 1]
                : null;


        const present =
            employeeAttendance.filter(
                item =>
                    (item.status || "").toLowerCase() ===
                    "present"
            ).length;

        const absent =
            employeeAttendance.filter(
                item =>
                    (item.status || "").toLowerCase() ===
                    "absent"
            ).length;

        const late =
            employeeAttendance.filter(
                item =>
                    (item.status || "").toLowerCase() ===
                    "late"
            ).length;


        return (

            <div className="employee-full-report">

                <ReportHeader
                    title="Employee Full Report"
                    description="Complete employee information."
                    onBack={goBack}
                />


                {/* =========================
                        PROFILE HEADER
                ========================= */}

                <div className="employee-report-profile">

                    <div className="employee-report-avatar">

                        {employee.profileImage ? (

                            <img
                                src={employee.profileImage}
                                alt={employee.name || "Employee"}
                            />

                        ) : (

                            <span>
                                {(employee.name || "E")
                                    .charAt(0)
                                    .toUpperCase()}
                            </span>

                        )}

                    </div>


                    <div className="employee-report-profile-info">

                        <h2>
                            {employee.name || "--"}
                        </h2>

                        <p>
                            {employee.designation || "--"}
                        </p>

                        <div className="employee-report-tags">

                            <span>
                                {employee.employeeId || "--"}
                            </span>

                            <span>
                                {employee.department || "--"}
                            </span>

                            <span
                                className={
                                    employee.status === "Active"
                                        ? "active"
                                        : "inactive"
                                }
                            >
                                {employee.status || "Unknown"}
                            </span>

                        </div>

                    </div>

                </div>


                {/* =========================
                        PERSONAL INFORMATION
                ========================= */}

                <ReportSection
                    icon={<FaUser />}
                    title="Personal Information"
                >

                    <InfoGrid>

                        <InfoItem
                            label="Full Name"
                            value={employee.name}
                        />

                        <InfoItem
                            label="Email"
                            value={employee.email}
                        />

                        <InfoItem
                            label="Phone"
                            value={employee.phone}
                        />

                        <InfoItem
                            label="Gender"
                            value={employee.gender}
                        />

                        <InfoItem
                            label="Date of Birth"
                            value={employee.dateOfBirth}
                        />

                        <InfoItem
                            label="Address"
                            value={employee.address}
                        />

                        <InfoItem
                            label="Emergency Contact"
                            value={
                                employee.emergencyContact
                            }
                        />

                    </InfoGrid>

                </ReportSection>


                {/* =========================
                        JOB INFORMATION
                ========================= */}

                <ReportSection
                    icon={<FaBriefcase />}
                    title="Job Information"
                >

                    <InfoGrid>

                        <InfoItem
                            label="Employee ID"
                            value={employee.employeeId}
                        />

                        <InfoItem
                            label="Department"
                            value={employee.department}
                        />

                        <InfoItem
                            label="Designation"
                            value={employee.designation}
                        />

                        <InfoItem
                            label="Role"
                            value={employee.role}
                        />

                        <InfoItem
                            label="Joining Date"
                            value={employee.joiningDate}
                        />

                        <InfoItem
                            label="Employment Status"
                            value={employee.status}
                        />

                    </InfoGrid>

                </ReportSection>


                {/* =========================
                        BANK DETAILS
                ========================= */}

                <ReportSection
                    icon={<FaUniversity />}
                    title="Bank Details"
                >

                    <InfoGrid>

                        <InfoItem
                            label="Bank Name"
                            value={
                                employee.bankDetails?.bankName ||
                                employee.bankName
                            }
                        />

                        <InfoItem
                            label="Account Number"
                            value={
                                employee.bankDetails?.accountNumber ||
                                employee.accountNumber
                            }
                        />

                        <InfoItem
                            label="IFSC Code"
                            value={
                                employee.bankDetails?.ifscCode ||
                                employee.ifscCode
                            }
                        />

                        <InfoItem
                            label="Account Holder"
                            value={
                                employee.bankDetails?.accountHolder ||
                                employee.accountHolder ||
                                employee.name
                            }
                        />

                    </InfoGrid>

                </ReportSection>


                {/* =========================
                        PAYROLL
                ========================= */}

                <ReportSection
                    icon={<FaWallet />}
                    title="Payroll Information"
                >

                    <InfoGrid>

                        <InfoItem
                            label="Basic Salary"
                            value={
                                `₹${Number(
                                    employee.basicSalary ||
                                    employee.salary ||
                                    0
                                ).toLocaleString("en-IN")}`
                            }
                        />

                        <InfoItem
                            label="Latest Allowances"
                            value={
                                latestPayroll
                                    ? `₹${Number(
                                        latestPayroll.allowance || 0
                                    ).toLocaleString("en-IN")}`
                                    : "--"
                            }
                        />

                        <InfoItem
                            label="Latest Deductions"
                            value={
                                latestPayroll
                                    ? `₹${Number(
                                        latestPayroll.deduction || 0
                                    ).toLocaleString("en-IN")}`
                                    : "--"
                            }
                        />

                        <InfoItem
                            label="Latest Net Salary"
                            value={
                                latestPayroll
                                    ? `₹${Number(
                                        latestPayroll.netSalary || 0
                                    ).toLocaleString("en-IN")}`
                                    : "--"
                            }
                        />

                        <InfoItem
                            label="Payroll Month"
                            value={
                                latestPayroll?.month || "--"
                            }
                        />

                        <InfoItem
                            label="Payment Status"
                            value={
                                latestPayroll?.status || "--"
                            }
                        />

                    </InfoGrid>

                </ReportSection>


                {/* =========================
                        ATTENDANCE
                ========================= */}

                <ReportSection
                    icon={<FaCalendarAlt />}
                    title="Attendance Summary"
                >

                    <ReportStats
                        items={[
                            ["Total Days", employeeAttendance.length],
                            ["Present", present],
                            ["Absent", absent],
                            ["Late", late],
                        ]}
                    />


                    <div className="report-table-wrapper">

                        <table className="report-table">

                            <thead>

                                <tr>
                                    <th>Date</th>
                                    <th>Check In</th>
                                    <th>Check Out</th>
                                    <th>Working Hours</th>
                                    <th>Status</th>
                                </tr>

                            </thead>

                            <tbody>

                                {employeeAttendance.length === 0 ? (

                                    <EmptyRow
                                        message="No attendance records found."
                                        colSpan="5"
                                    />

                                ) : (

                                    employeeAttendance.map(record => {

                                        const status =
                                            record.status ||
                                            "Unknown";

                                        return (

                                            <tr key={record.id || `${record.employeeId}-${record.date}`}>

                                                <td>
                                                    {record.date || "--"}
                                                </td>

                                                <td>
                                                    {record.checkIn || "--"}
                                                </td>

                                                <td>
                                                    {record.checkOut || "--"}
                                                </td>

                                                <td>
                                                    {record.workingHours || "--"}
                                                </td>

                                                <td>

                                                    <StatusBadge
                                                        status={status}
                                                    />

                                                </td>

                                            </tr>

                                        );

                                    })

                                )}

                            </tbody>

                        </table>

                    </div>

                </ReportSection>


                {/* =========================
                        LEAVE
                ========================= */}

                <ReportSection
                    icon={<FaClipboardList />}
                    title="Leave History"
                >

                    <div className="report-table-wrapper">

                        <table className="report-table">

                            <thead>

                                <tr>
                                    <th>Type</th>
                                    <th>From</th>
                                    <th>To</th>
                                    <th>Reason</th>
                                    <th>Status</th>
                                </tr>

                            </thead>

                            <tbody>

                                {employeeLeaves.length === 0 ? (

                                    <EmptyRow
                                        message="No leave records found."
                                        colSpan="5"
                                    />

                                ) : (

                                    employeeLeaves.map(leave => (

                                        <tr key={leave.id}>

                                            <td>
                                                {leave.leaveType || "--"}
                                            </td>

                                            <td>
                                                {leave.fromDate || "--"}
                                            </td>

                                            <td>
                                                {leave.toDate || "--"}
                                            </td>

                                            <td className="report-reason">
                                                {leave.reason || "--"}
                                            </td>

                                            <td>

                                                <StatusBadge
                                                    status={
                                                        leave.status ||
                                                        "Pending"
                                                    }
                                                />

                                            </td>

                                        </tr>

                                    ))

                                )}

                            </tbody>

                        </table>

                    </div>

                </ReportSection>


                {/* =========================
                        TASKS
                ========================= */}

                <ReportSection
                    icon={<FaTasks />}
                    title="Task History"
                >

                    <div className="report-table-wrapper">

                        <table className="report-table">

                            <thead>

                                <tr>
                                    <th>Task</th>
                                    <th>Priority</th>
                                    <th>Due Date</th>
                                    <th>Status</th>
                                </tr>

                            </thead>

                            <tbody>

                                {employeeTasks.length === 0 ? (

                                    <EmptyRow
                                        message="No tasks found."
                                        colSpan="4"
                                    />

                                ) : (

                                    employeeTasks.map(task => {

                                        const status =
                                            task.status ||
                                            "Pending";

                                        return (

                                            <tr key={task.id}>

                                                <td>

                                                    <strong>
                                                        {task.title || "--"}
                                                    </strong>

                                                    <small className="report-description">
                                                        {task.description || ""}
                                                    </small>

                                                </td>

                                                <td>
                                                    {task.priority || "Normal"}
                                                </td>

                                                <td>
                                                    {task.dueDate || "--"}
                                                </td>

                                                <td>

                                                    <StatusBadge
                                                        status={status}
                                                    />

                                                </td>

                                            </tr>

                                        );

                                    })

                                )}

                            </tbody>

                        </table>

                    </div>

                </ReportSection>

            </div>

        );

    };


    /* ===============================
            REPORT VIEW
    =============================== */

    const renderReport = () => {

        /* =========================
            EMPLOYEE FULL REPORT
        ========================= */

        if (
            selectedReport === "employees" &&
            selectedEmployee
        ) {

            return renderEmployeeFullReport();

        }


        switch (selectedReport) {

            /* =========================
                    EMPLOYEES
            ========================= */

            case "employees":

                return (

                    <div className="report-content">

                        <ReportHeader
                            title="Employee Report"
                            description="Complete employee directory."
                            onBack={goBack}
                        />

                        <ReportStats
                            items={[
                                [
                                    "Total Employees",
                                    employees.length,
                                ],
                                [
                                    "Active",
                                    employees.filter(
                                        e =>
                                            e.status === "Active"
                                    ).length,
                                ],
                                [
                                    "Departments",
                                    new Set(
                                        employees
                                            .map(
                                                e =>
                                                    e.department
                                            )
                                            .filter(Boolean)
                                    ).size,
                                ],
                            ]}
                        />


                        <div className="report-table-wrapper">

                            <table className="report-table">

                                <thead>

                                    <tr>

                                        <th>Employee</th>
                                        <th>Employee ID</th>
                                        <th>Department</th>
                                        <th>Designation</th>
                                        <th>Status</th>
                                        <th>Action</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {employees.length === 0 ? (

                                        <EmptyRow
                                            message="No employees found."
                                            colSpan="6"
                                        />

                                    ) : (

                                        employees.map(employee => (

                                            <tr key={employee.id}>

                                                <td>
                                                    <strong>
                                                        {employee.name || "--"}
                                                    </strong>
                                                </td>

                                                <td>
                                                    {employee.employeeId || "--"}
                                                </td>

                                                <td>
                                                    {employee.department || "--"}
                                                </td>

                                                <td>
                                                    {employee.designation || "--"}
                                                </td>

                                                <td>

                                                    <StatusBadge
                                                        status={
                                                            employee.status ||
                                                            "Unknown"
                                                        }
                                                    />

                                                </td>

                                                <td>

                                                    <button
                                                        className="report-view-btn"
                                                        type="button"
                                                        onClick={() =>
                                                            setSelectedEmployee(
                                                                employee
                                                            )
                                                        }
                                                    >

                                                        <FaEye />

                                                        View

                                                    </button>

                                                </td>

                                            </tr>

                                        ))

                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                );


            /* =========================
                    ATTENDANCE
            ========================= */

            case "attendance":

                return (

                    <div className="report-content">

                        <ReportHeader
                            title="Attendance Report"
                            description="Organization-wide attendance records."
                            onBack={goBack}
                        />

                        <ReportStats
                            items={[
                                [
                                    "Total Records",
                                    attendanceStats.total,
                                ],
                                [
                                    "Present",
                                    attendanceStats.present,
                                ],
                                [
                                    "Absent",
                                    attendanceStats.absent,
                                ],
                                [
                                    "Late",
                                    attendanceStats.late,
                                ],
                            ]}
                        />

                        <ReportToolbar
                            label="Attendance Records"
                            count={`${attendanceStats.total} records found`}
                            onDownload={exportAttendancePDF}
                        />


                        <div className="report-table-wrapper">

                            <table className="report-table">

                                <thead>

                                    <tr>

                                        <th>Employee</th>
                                        <th>Date</th>
                                        <th>Check In</th>
                                        <th>Check Out</th>
                                        <th>Working Hours</th>
                                        <th>Status</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {attendanceRecords.length === 0 ? (

                                        <EmptyRow
                                            message="No attendance records found."
                                            colSpan="6"
                                        />

                                    ) : (

                                        attendanceRecords.map(record => {

                                            const employee =
                                                employees.find(
                                                    e =>
                                                        e.employeeId ===
                                                            record.employeeId ||
                                                        e.id ===
                                                            record.employeeId
                                                );

                                            const status =
                                                record.status ||
                                                "Unknown";

                                            return (

                                                <tr key={record.id}>

                                                    <td>
                                                        {employee?.name ||
                                                            record.employeeId ||
                                                            "--"}
                                                    </td>

                                                    <td>
                                                        {record.date || "--"}
                                                    </td>

                                                    <td>
                                                        {record.checkIn || "--"}
                                                    </td>

                                                    <td>
                                                        {record.checkOut || "--"}
                                                    </td>

                                                    <td>
                                                        {record.workingHours || "--"}
                                                    </td>

                                                    <td>

                                                        <StatusBadge
                                                            status={status}
                                                        />

                                                    </td>

                                                </tr>

                                            );

                                        })

                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                );


            /* =========================
                    LEAVE
            ========================= */

            case "leave":

                return (

                    <div className="report-content">

                        <ReportHeader
                            title="Leave Report"
                            description="Employee leave requests and approval history."
                            onBack={goBack}
                        />

                        <ReportStats
                            items={[
                                [
                                    "Total Requests",
                                    leaveStats.total,
                                ],
                                [
                                    "Pending",
                                    leaveStats.pending,
                                ],
                                [
                                    "Approved",
                                    leaveStats.approved,
                                ],
                                [
                                    "Rejected",
                                    leaveStats.rejected,
                                ],
                            ]}
                        />

                        <ReportToolbar
                            label="Leave Records"
                            count={`${leaveStats.total} requests found`}
                            onDownload={exportLeavePDF}
                        />


                        <div className="report-table-wrapper">

                            <table className="report-table">

                                <thead>

                                    <tr>

                                        <th>Employee</th>
                                        <th>Leave Type</th>
                                        <th>From</th>
                                        <th>To</th>
                                        <th>Reason</th>
                                        <th>Status</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {(leaveRequests || []).length === 0 ? (

                                        <EmptyRow
                                            message="No leave requests found."
                                            colSpan="6"
                                        />

                                    ) : (

                                        leaveRequests.map(leave => (

                                            <tr key={leave.id}>

                                                <td>
                                                    {leave.employeeName || "--"}
                                                </td>

                                                <td>
                                                    {leave.leaveType || "--"}
                                                </td>

                                                <td>
                                                    {leave.fromDate || "--"}
                                                </td>

                                                <td>
                                                    {leave.toDate || "--"}
                                                </td>

                                                <td className="report-reason">
                                                    {leave.reason || "--"}
                                                </td>

                                                <td>

                                                    <StatusBadge
                                                        status={
                                                            leave.status ||
                                                            "Pending"
                                                        }
                                                    />

                                                </td>

                                            </tr>

                                        ))

                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                );


            /* =========================
                    PAYROLL
            ========================= */

            case "payroll":

                return (

                    <div className="report-content">

                        <ReportHeader
                            title="Payroll Report"
                            description="Generated payroll records for all employees."
                            onBack={goBack}
                        />

                        <ReportStats
                            items={[
                                [
                                    "Employees",
                                    employees.length,
                                ],
                                [
                                    "Payroll Records",
                                    payrollStats.generated,
                                ],
                                [
                                    "Total Net Payroll",
                                    `₹${payrollStats.totalNetSalary.toLocaleString(
                                        "en-IN"
                                    )}`,
                                ],
                            ]}
                        />

                        <ReportToolbar
                            label="Payroll Records"
                            count={`${payrollStats.generated} payroll records`}
                            onDownload={exportPayrollPDF}
                        />


                        <div className="report-table-wrapper">

                            <table className="report-table">

                                <thead>

                                    <tr>

                                        <th>Employee</th>
                                        <th>Month</th>
                                        <th>Basic</th>
                                        <th>Allowances</th>
                                        <th>Deductions</th>
                                        <th>Net Salary</th>
                                        <th>Status</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {payrollStats.generated === 0 ? (

                                        <EmptyRow
                                            message="No payroll records found."
                                            colSpan="7"
                                        />

                                    ) : (

                                        employees.flatMap(employee =>

                                            (
                                                employee.payrollHistory ||
                                                []
                                            ).map(payroll => (

                                            <tr key={payroll.id}>

                                                <td>
                                                    {employee.name || "--"}
                                                </td>

                                                <td>
                                                    {payroll.month || "--"}
                                                </td>

                                                <td>
                                                    ₹
                                                    {Number(
                                                        payroll.basic || 0
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )}
                                                </td>

                                                <td>
                                                    ₹
                                                    {Number(
                                                        payroll.allowance || 0
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )}
                                                </td>

                                                <td>
                                                    ₹
                                                    {Number(
                                                        payroll.deduction || 0
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )}
                                                </td>

                                                <td>

                                                    <strong>
                                                        ₹
                                                        {Number(
                                                            payroll.netSalary ||
                                                            0
                                                        ).toLocaleString(
                                                            "en-IN"
                                                        )}
                                                    </strong>

                                                </td>

                                                <td>

                                                    <StatusBadge
                                                        status={
                                                            payroll.status ||
                                                            "Generated"
                                                        }
                                                    />

                                                </td>

                                            </tr>

                                            ))

                                        )

                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                );


            /* =========================
                    TASKS
            ========================= */

            case "tasks":

                return (

                    <div className="report-content">

                        <ReportHeader
                            title="Task Report"
                            description="Organization-wide employee task progress."
                            onBack={goBack}
                        />

                        <ReportStats
                            items={[
                                [
                                    "Total Tasks",
                                    taskStats.total,
                                ],
                                [
                                    "Pending",
                                    taskStats.pending,
                                ],
                                [
                                    "In Progress",
                                    taskStats.progress,
                                ],
                                [
                                    "Completed",
                                    taskStats.completed,
                                ],
                                [
                                    "Failed",
                                    taskStats.failed,
                                ],
                            ]}
                        />

                        <ReportToolbar
                            label="Task Records"
                            count={`${taskStats.total} tasks found`}
                            onDownload={exportTaskPDF}
                        />


                        <div className="report-table-wrapper">

                            <table className="report-table">

                                <thead>

                                    <tr>

                                        <th>Employee</th>
                                        <th>Task</th>
                                        <th>Priority</th>
                                        <th>Due Date</th>
                                        <th>Status</th>
                                        <th>Updated</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {(tasks || []).length === 0 ? (

                                        <EmptyRow
                                            message="No tasks found."
                                            colSpan="6"
                                        />

                                    ) : (

                                        tasks.map(task => {

                                            const status =
                                                task.status ||
                                                "Pending";

                                            return (

                                                <tr key={task.id}>

                                                    <td>
                                                        {task.employeeName ||
                                                            task.employeeId ||
                                                            "--"}
                                                    </td>

                                                    <td>

                                                        <strong>
                                                            {task.title || "--"}
                                                        </strong>

                                                        <small className="report-description">
                                                            {task.description || ""}
                                                        </small>

                                                    </td>

                                                    <td>
                                                        {task.priority || "Normal"}
                                                    </td>

                                                    <td>
                                                        {task.dueDate || "--"}
                                                    </td>

                                                    <td>

                                                        <StatusBadge
                                                            status={status}
                                                        />

                                                    </td>

                                                    <td>
                                                        {task.updatedAt ||
                                                            task.createdAt ||
                                                            "--"}
                                                    </td>

                                                </tr>

                                            );

                                        })

                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                );


            /* =========================
                    DEFAULT
            ========================= */

            default:

                return (

                    <div className="reports-container">

                        <div className="reports-grid">

                            {reports.map(report => (

                                <button
                                    key={report.id}
                                    type="button"
                                    className="report-card"
                                    onClick={() =>
                                        setSelectedReport(
                                            report.id
                                        )
                                    }
                                >

                                    <div className="report-icon">
                                        {report.icon}
                                    </div>

                                    <h3>
                                        {report.title}
                                    </h3>

                                    <p>
                                        {report.description}
                                    </p>

                                    <span className="report-card-action">
                                        Open Report
                                    </span>

                                </button>

                            ))}

                        </div>

                    </div>

                );

        }

    };


    return (

        <Modal
            open={open}
            title="Reports Center"
            onClose={handleClose}
            size="large"
        >

            {renderReport()}

        </Modal>

    );

};


/* =================================
        REPORT HEADER
================================= */

const ReportHeader = ({
    title,
    description,
    onBack,
}) => {

    return (

        <div className="report-inner-header">

            <div>

                <h3>
                    {title}
                </h3>

                <p>
                    {description}
                </p>

            </div>

            <button
                type="button"
                className="report-back-btn"
                onClick={onBack}
            >

                <FaArrowLeft />

                Reports

            </button>

        </div>

    );

};


/* =================================
        REPORT SECTION
================================= */

const ReportSection = ({
    icon,
    title,
    children,
}) => {

    return (

        <section className="employee-report-section">

            <div className="employee-report-section-header">

                <div className="employee-report-section-icon">

                    {icon}

                </div>

                <h3>
                    {title}
                </h3>

            </div>

            {children}

        </section>

    );

};


/* =================================
        INFO GRID
================================= */

const InfoGrid = ({ children }) => {

    return (

        <div className="employee-report-info-grid">

            {children}

        </div>

    );

};


/* =================================
        INFO ITEM
================================= */

const InfoItem = ({
    label,
    value,
}) => {

    return (

        <div className="employee-report-info-item">

            <span>
                {label}
            </span>

            <strong>
                {value || "--"}
            </strong>

        </div>

    );

};


/* =================================
        STATUS BADGE
================================= */

const StatusBadge = ({ status }) => {

    const safeStatus =
        status || "Unknown";

    const className =
        safeStatus
            .toLowerCase()
            .replace(/\s+/g, "-");

    return (

        <span
            className={`report-status ${className}`}
        >

            {safeStatus}

        </span>

    );

};


/* =================================
        REPORT TOOLBAR
================================= */

const ReportToolbar = ({
    label,
    count,
    onDownload,
}) => {

    return (

        <div className="report-toolbar">

            <div className="report-toolbar-info">

                <strong>{label}</strong>

                <span>{count}</span>

            </div>

            <button
                type="button"
                className="report-pdf-btn"
                onClick={onDownload}
            >
                <FaFilePdf />
                Download PDF
            </button>

        </div>

    );
};


/* =================================
        REPORT STATS
================================= */

const ReportStats = ({ items }) => {

    return (

        <div className="report-summary">

            {items.map(([label, value]) => (

                <div key={label}>

                    <span>
                        {label}
                    </span>

                    <strong>
                        {value}
                    </strong>

                </div>

            ))}

        </div>

    );

};


/* =================================
        EMPTY ROW
================================= */

const EmptyRow = ({
    message,
    colSpan,
}) => {

    return (

        <tr>

            <td
                colSpan={colSpan}
                className="report-empty"
            >

                {message}

            </td>

        </tr>

    );

};


export default ReportsModal;