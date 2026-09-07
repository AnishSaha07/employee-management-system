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


const StatCards = () => {

    const {
        employees = [],
    } = useEmployees();


    const {
        adminAttendance = [],
        fetchTodayAttendance,
    } = useAttendance();


    const {
        getEmployeesOnLeaveToday,
    } = useLeave();


    /* ==========================================
                LOAD TODAY ATTENDANCE
    ========================================== */

    useEffect(() => {

        fetchTodayAttendance();

    }, [fetchTodayAttendance]);


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

        return adminAttendance.filter(
            (record) => {

                if (!record.date) {
                    return false;
                }

                const recordDate =
                    String(record.date)
                        .split("T")[0];

                return recordDate === today;

            }
        );

    }, [adminAttendance, today]);


    /* ==========================================
                TOTAL EMPLOYEES
    ========================================== */

    const totalEmployees =
        Array.isArray(employees)
            ? employees.length
            : 0;


    /* ==========================================
                    ON LEAVE
    ========================================== */

    const onLeave =
        typeof getEmployeesOnLeaveToday === "function"
            ? getEmployeesOnLeaveToday().length
            : 0;


    /* ==========================================
                PRESENT TODAY
    ========================================== */

    const presentToday =
        todayRecords.filter(
            (record) =>
                record.status === "Present"
        ).length;


    /* ==========================================
                PENDING TASKS
    ========================================== */

    const pendingTasks =
        employees.reduce(
            (total, employee) => {

                const tasks =
                    Array.isArray(employee.tasks)
                        ? employee.tasks
                        : [];

                return (
                    total +
                    tasks.filter(
                        (task) =>
                            task.status ===
                            "Pending"
                    ).length
                );

            },
            0
        );


    /* ==========================================
                MONTHLY PAYROLL
    ========================================== */

    const monthlyPayroll =
        employees.reduce(
            (total, employee) => {

                return (
                    total +
                    Number(
                        employee.salary || 0
                    )
                );

            },
            0
        );


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

            value:
                `₹${monthlyPayroll.toLocaleString(
                    "en-IN"
                )}`,

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

            {cards.map(
                (card, index) => (

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

                )
            )}

        </section>

    );

};


export default StatCards;