import { useMemo } from "react";

import "./EmployeeStatCards.css"

import {
    FaCalendarCheck,
    FaTasks,
    FaUmbrellaBeach,
    FaMoneyBillWave,
} from "react-icons/fa";

import { useAttendance } from "../../../context/AttendenceContext";
import { useTask } from "../../../context/TaskContext";
import { useLeave } from "../../../context/LeaveContext";
import { usePayroll } from "../../../context/PayrollContext";

import { getCurrentUser } from "../../../utils/auth";


const EmployeeStatCards = () => {

    /* ==========================================
                    CURRENT USER
    ========================================== */

    const currentUser = getCurrentUser();


    const employeeId =
        currentUser?.employeeId;


    /* ==========================================
                    ATTENDANCE
    ========================================== */

    const {
        attendance = [],
    } = useAttendance();


    /* ==========================================
                    TASKS
    ========================================== */

    const {
        tasks = [],
    } = useTask();


    /* ==========================================
                    LEAVES
    ========================================== */

    const {
        leaveRequests = [],
    } = useLeave();


    /* ==========================================
                    PAYROLL
    ========================================== */

    const {
        payrollRecords = [],
    } = usePayroll();


    /* ==========================================
                EMPLOYEE TASKS
    ========================================== */

    const employeeTasks = useMemo(() => {

        if (!employeeId) {
            return [];
        }

        return tasks.filter(
            (task) =>
                task.employeeId === employeeId
        );

    }, [
        tasks,
        employeeId,
    ]);


    /* ==========================================
                EMPLOYEE LEAVES
    ========================================== */

    const employeeLeaves = useMemo(() => {

        if (!employeeId) {
            return [];
        }

        return leaveRequests.filter(
            (leave) =>
                leave.employeeId === employeeId
        );

    }, [
        leaveRequests,
        employeeId,
    ]);


    /* ==========================================
                EMPLOYEE PAYROLL
    ========================================== */

    const employeePayroll = useMemo(() => {

        if (!employeeId) {
            return [];
        }

        return payrollRecords
            .filter(
                (payroll) =>
                    payroll.employeeId === employeeId
            )
            .sort(
                (a, b) =>
                    new Date(
                        b.month || b.createdAt
                    ) -
                    new Date(
                        a.month || a.createdAt
                    )
            );

    }, [
        payrollRecords,
        employeeId,
    ]);


    /* ==========================================
                ATTENDANCE STATISTICS
    ========================================== */

    const attendanceStats = useMemo(() => {

        const present =
            attendance.filter(
                (record) =>
                    record.status === "Present"
            ).length;


        const absent =
            attendance.filter(
                (record) =>
                    record.status === "Absent"
            ).length;


        const late =
            attendance.filter(
                (record) =>
                    record.status === "Late"
            ).length;


        const total =
            attendance.length;


        const percentage =
            total > 0
                ? Math.round(
                    ((present + late) / total) * 100
                )
                : 0;


        return {
            present,
            absent,
            late,
            total,
            percentage,
        };

    }, [
        attendance,
    ]);


    /* ==========================================
                    TASK STATISTICS
    ========================================== */

    const pendingTasks =
        employeeTasks.filter(
            (task) =>
                task.status !== "Completed"
        ).length;


    /* ==========================================
                    LEAVE STATISTICS
    ========================================== */

    const approvedLeaves =
        employeeLeaves.filter(
            (leave) =>
                leave.status === "Approved"
        ).length;


    /* ==========================================
                    LATEST PAYROLL
    ========================================== */

    const latestPayroll =
        employeePayroll.length > 0
            ? employeePayroll[0]
            : null;


    /* ==========================================
                    NET SALARY

        IMPORTANT:

        Salary comes ONLY from the payroll
        record generated by Admin.

        No hardcoded salary.
        No employee.payrollHistory.
    ========================================== */

    const netSalary =
        latestPayroll
            ? Number(
                latestPayroll.netSalary || 0
            )
            : 0;


    /* ==========================================
                    STAT CARDS
    ========================================== */

    const stats = [

        {
            id: "attendance",

            title: "Attendance",

            value:
                `${attendanceStats.percentage}%`,

            icon:
                <FaCalendarCheck />,

            color:
                "#2563eb",
        },


        {
            id: "tasks",

            title: "Pending Tasks",

            value:
                pendingTasks,

            icon:
                <FaTasks />,

            color:
                "#22c55e",
        },


        {
            id: "leave",

            title: "Approved Leaves",

            value:
                approvedLeaves,

            icon:
                <FaUmbrellaBeach />,

            color:
                "#f59e0b",
        },


        {
            id: "salary",

            title: "Net Salary",

            value:
                `₹${netSalary.toLocaleString("en-IN")}`,

            icon:
                <FaMoneyBillWave />,

            color:
                "#8b5cf6",
        },

    ];


    /* ==========================================
                    RENDER
    ========================================== */

    return (

        <div className="stats-grid">

            {stats.map((stat) => (

                <div
                    className="stat-card"
                    key={stat.id}
                >

                    <div
                        className="stat-icon"
                        style={{
                            backgroundColor:
                                stat.color,
                        }}
                    >
                        {stat.icon}
                    </div>


                    <div className="stat-info">

                        <span className="stat-title">
                            {stat.title}
                        </span>


                        <strong className="stat-value">
                            {stat.value}
                        </strong>

                    </div>

                </div>

            ))}

        </div>

    );

};


export default EmployeeStatCards;