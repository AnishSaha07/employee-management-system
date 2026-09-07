import { useEffect, useState } from "react";

import "./EmployeeDashboard.css";

import EmployeeSidebar from "../components/EmployeeSidebar";
import EmployeeTopbar from "../components/EmployeeTopbar";

import EmployeeStatCards from "../components/EmployeeStatCards";
import EmployeeQuickActions from "../components/EmployeeQuickActions";

import AttendanceSummaryCard from "../components/AttendanceSummaryCard";
import TaskSummaryCard from "../components/TaskSummaryCard";
import LeaveSummaryCard from "../components/LeaveSummaryCard";
import UpcomingDeadlines from "../components/UpcomingDeadlines";
import PayslipCard from "../components/PayslipCard";
import AnnouncementCard from "../components/AnnouncementCard";

import EmployeeAttendance from "../Pages/EmployeeAttendance";
import EmployeeTasks from "../Pages/EmployeeTasks";
import EmployeeLeave from "../Pages/EmployeeLeave";
import EmployeePayroll from "../Pages/EmployeePayroll";
import EmployeeProfile from "../Pages/EmployeeProfile";
import EmployeeSettings from "../components/EmployeeSettings";

import { useAttendance } from "../../../context/AttendenceContext";
import { useTask } from "../../../context/TaskContext";
import { useLeave } from "../../../context/LeaveContext";
import { usePayroll } from "../../../context/PayrollContext";


const EmployeeDashboard = () => {

    const [activeSection, setActiveSection] =
        useState("dashboard");


    /* ==========================================
                CONTEXTS
    ========================================== */

    const {
        fetchMyAttendance,
    } = useAttendance();


    const {
        fetchMyTasks,
    } = useTask();


    const {
        fetchMyLeaves,
    } = useLeave();


    const {
        fetchMyPayroll,
    } = usePayroll();


    /* ==========================================
          LOAD ALL EMPLOYEE DASHBOARD DATA
          
          This runs when /employee loads
          or browser is refreshed.
    ========================================== */

    useEffect(() => {

        const loadDashboardData = async () => {

            try {

                await Promise.all([
                    fetchMyAttendance(),
                    fetchMyTasks(),
                    fetchMyLeaves(),
                    fetchMyPayroll(),
                ]);

            } catch (error) {

                console.error(
                    "Employee dashboard data loading error:",
                    error
                );

            }

        };


        loadDashboardData();

    }, [
        fetchMyAttendance,
        fetchMyTasks,
        fetchMyLeaves,
        fetchMyPayroll,
    ]);


    /* ==========================================
                    RENDER
    ========================================== */

    return (

        <div className="employee-layout">

            <EmployeeSidebar
                activeSection={activeSection}
                setActiveSection={setActiveSection}
            />


            <main className="employee-content">

                <EmployeeTopbar
                    activeSection={activeSection}
                />


                {/* ==================================
                            DASHBOARD
                ================================== */}

                {activeSection === "dashboard" && (

                    <section className="employee-dashboard">

                        <EmployeeStatCards />


                        <EmployeeQuickActions
                            setActiveSection={
                                setActiveSection
                            }
                        />


                        <div className="dashboard-grid">

                            <AttendanceSummaryCard />


                            <TaskSummaryCard
                                setActiveSection={
                                    setActiveSection
                                }
                            />


                            <LeaveSummaryCard
                                setActiveSection={
                                    setActiveSection
                                }
                            />


                            <UpcomingDeadlines
                                setActiveSection={
                                    setActiveSection
                                }
                            />


                            <PayslipCard
                                setActiveSection={
                                    setActiveSection
                                }
                            />


                            <AnnouncementCard />

                        </div>

                    </section>

                )}


                {/* ==================================
                         ATTENDANCE
                ================================== */}

                {activeSection === "attendance" && (

                    <EmployeeAttendance />

                )}


                {/* ==================================
                            TASKS
                ================================== */}

                {activeSection === "tasks" && (

                    <EmployeeTasks />

                )}


                {/* ==================================
                            LEAVE
                ================================== */}

                {activeSection === "leave" && (

                    <EmployeeLeave />

                )}


                {/* ==================================
                           PAYROLL
                ================================== */}

                {activeSection === "payroll" && (

                    <EmployeePayroll />

                )}


                {/* ==================================
                           PROFILE
                ================================== */}

                {activeSection === "profile" && (

                    <EmployeeProfile />

                )}


                {/* ==================================
                           SETTINGS
                ================================== */}

                {activeSection === "settings" && (

                    <EmployeeSettings />

                )}

            </main>

        </div>

    );

};


export default EmployeeDashboard;