import { useEffect, useMemo } from "react";

import "./StatCards.css";

import {
    FaUsers,
    FaUserCheck,
    FaUserClock,
    FaClipboardList,
    FaMoneyBillWave,
    FaArrowTrendUp,
    FaArrowTrendDown,
} from "react-icons/fa6";

import { useEmployees } from "../../../context/EmployeeContext";
import { useAttendance } from "../../../context/AttendenceContext";
import { useLeave } from "../../../context/LeaveContext";
import { useTask } from "../../../context/TaskContext";
import { usePayroll } from "../../../context/PayrollContext";


const StatCards = () => {

    /* ==========================================
       EMPLOYEES
    ========================================== */

    const {
        employees = [],
    } = useEmployees();


    /* ==========================================
       ATTENDANCE
    ========================================== */

    const {
        adminAttendance = [],
        fetchTodayAttendance,
    } = useAttendance();


    /* ==========================================
       LEAVE
    ========================================== */

    const {
        leaveRequests = [],
        fetchAllLeaves,
    } = useLeave();


    /* ==========================================
       TASKS
    ========================================== */

    const {
        tasks = [],
        fetchAllTasks,
    } = useTask();


    /* ==========================================
       PAYROLL
    ========================================== */

    const {
        payrollRecords = [],
        fetchAllPayroll,
    } = usePayroll();


    /* ==========================================
       LOAD ADMIN DASHBOARD DATA
    ========================================== */

    useEffect(() => {

        const loadDashboardData = async () => {

            await Promise.allSettled([
                fetchTodayAttendance(),
                fetchAllLeaves(),
                fetchAllTasks(),
                fetchAllPayroll(),
            ]);

        };

        loadDashboardData();

    }, [
        fetchTodayAttendance,
        fetchAllLeaves,
        fetchAllTasks,
        fetchAllPayroll,
    ]);


    /* ==========================================
       TODAY DATE
    ========================================== */

    const today = useMemo(() => {

        return new Date()
            .toISOString()
            .split("T")[0];

    }, []);


    /* ==========================================
       TODAY ATTENDANCE
    ========================================== */

    const todayRecords = useMemo(() => {

        if (!Array.isArray(adminAttendance)) {
            return [];
        }

        return adminAttendance.filter((record) => {

            if (!record.date) {
                return false;
            }

            const recordDate =
                String(record.date).split("T")[0];

            return recordDate === today;

        });

    }, [adminAttendance, today]);


    /* ==========================================
       PRESENT TODAY
    ========================================== */

    const presentToday = useMemo(() => {

        return todayRecords.filter(
            (record) =>
                record.status === "Present"
        ).length;

    }, [todayRecords]);


    /* ==========================================
       ON LEAVE TODAY
    ========================================== */

    const onLeave = useMemo(() => {

        if (!Array.isArray(leaveRequests)) {
            return 0;
        }

        return leaveRequests.filter((leave) => {

            const fromDate = new Date(leave.fromDate);
            const toDate = new Date(leave.toDate);
            const currentDate = new Date(today);

            return (
                leave.status === "Approved" &&
                currentDate >= fromDate &&
                currentDate <= toDate
            );

        }).length;

    }, [leaveRequests, today]);


    /* ==========================================
       PENDING TASKS
    ========================================== */

    const pendingTasks = useMemo(() => {

        if (!Array.isArray(tasks)) {
            return 0;
        }

        return tasks.filter(
            (task) =>
                task.status === "Pending"
        ).length;

    }, [tasks]);


    /* ==========================================
       MONTHLY PAYROLL
    ========================================== */

    const monthlyPayroll = useMemo(() => {

        /*
         * If payroll records exist, use the
         * actual payroll records generated
         * by Admin.
         */

        if (Array.isArray(payrollRecords) && payrollRecords.length > 0) {

            const currentMonth =
                new Date().toISOString().slice(0, 7);

            const currentMonthPayroll =
                payrollRecords.filter((payroll) => {

                    if (!payroll.month) {
                        return false;
                    }

                    return String(payroll.month).slice(0, 7)
                        === currentMonth;

                });

            return currentMonthPayroll.reduce(
                (total, payroll) => {

                    return (
                        total +
                        Number(
                            payroll.netSalary ||
                            payroll.netPay ||
                            0
                        )
                    );

                },
                0
            );
        }


        /*
         * Fallback:
         * Use the salary set on employee records.
         * This ensures the dashboard does not show
         * ₹0 simply because payroll hasn't been
         * generated yet.
         */

        return employees.reduce(
            (total, employee) => {

                const salary =
                    employee.basicSalary ??
                    employee.salary ??
                    0;

                return total + Number(salary);

            },
            0
        );

    }, [payrollRecords, employees]);


    /* ==========================================
       TOTAL EMPLOYEES
    ========================================== */

    const totalEmployees =
        Array.isArray(employees)
            ? employees.length
            : 0;


    /* ==========================================
       CARD DATA
    ========================================== */

    const cards = [

        {
            title: "Total Employees",
            value: totalEmployees,
            icon: <FaUsers />,
            color: "blue",
            positive: true,
            trend: "Current workforce",
        },

        {
            title: "Present Today",
            value: presentToday,
            icon: <FaUserCheck />,
            color: "green",
            positive: true,
            trend: "Today's attendance",
        },

        {
            title: "On Leave",
            value: onLeave,
            icon: <FaUserClock />,
            color: "orange",
            positive: false,
            trend: "Today's leave",
        },

        {
            title: "Pending Tasks",
            value: pendingTasks,
            icon: <FaClipboardList />,
            color: "purple",
            positive: true,
            trend: "Tasks pending",
        },

        {
            title: "Monthly Payroll",
            value: `₹${monthlyPayroll.toLocaleString("en-IN")}`,
            icon: <FaMoneyBillWave />,
            color: "emerald",
            positive: true,
            trend: "Current payroll",
        },

    ];


    /* ==========================================
       UI
    ========================================== */

    return (
        <section className="stats-grid">

            {cards.map((card, index) => (

                <div
                    className="stat-card"
                    key={index}
                >

                    <div className="stat-header">

                        <div>

                            <p>
                                {card.title}
                            </p>

                            <h2>
                                {card.value}
                            </h2>

                        </div>


                        <div
                            className={`icon ${card.color}`}
                        >
                            {card.icon}
                        </div>

                    </div>


                    <div
                        className={`trend ${
                            card.positive
                                ? "positive"
                                : "negative"
                        }`}
                    >

                        {card.positive ? (
                            <FaArrowTrendUp />
                        ) : (
                            <FaArrowTrendDown />
                        )}

                        <span>
                            {card.trend}
                        </span>

                    </div>

                </div>

            ))}

        </section>
    );
};


export default StatCards;