import { useState } from "react";

import React from "react";
import "./AdminDashboard.css";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatCards from "../components/StatCards";
import EmployeeOverview from "../components/EmployeeOverview";
import TaskSummary from "../components/TaskSummary";
import EmployeeTable from "../components/EmployeeTable";

import LeaveRequests from "../components/LeaveRequests";
import QuickActions from "../components/QuickActions";
import AssignTaskModal from "../Modals/AssignTaskModal";
import LeaveModal from "../Modals/LeaveModal";
import AddEmployeeModal from "../Modals/AddEmployeeModal";

import ReportsModal from "../Modals/ReportsModal";
import EmployeeManagement from "../Pages/EmployeeManagement";
import AttendanceManagement from "../Pages/AttendanceManagement";
import LeaveManagement from "../Pages/LeaveManagement";
import TaskManagement from "../Pages/TaskManagement";
import AdminPayroll from "../Pages/AdminPayroll";
import AdminSettings from "../Pages/AdminSettings";
import AdminReports from "../Pages/AdminReports";


function AdminDashboard() {

    // Modal State
    const [showAddEmployee, setShowAddEmployee] = useState(false);

    const [showAssignTask, setShowAssignTask] = useState(false);

    const [showLeave, setShowLeave] = useState(false);

    

    const [showReports, setShowReports] = useState(false);

    const [activeSection, setActiveSection] = useState("dashboard");

    return (

        <div className="admin-dashboard">

            <Sidebar
              activeSection={activeSection}
              setActiveSection={setActiveSection}
            />

  <main className="dashboard-content">

    <Topbar activeSection={activeSection} />

    {activeSection === "dashboard" && (

        <>

            <StatCards />

            <QuickActions
                onAddEmployee={() => setShowAddEmployee(true)}
                onAssignTask={() => setShowAssignTask(true)}
                onManageLeave={() => setShowLeave(true)}
                onPayroll={() => setActiveSection("payroll")}
                onReports={() => setShowReports(true)}
            />

            <div className="dashboard-row">

                <EmployeeOverview />

                <TaskSummary />

            </div>

            <div className="dashboard-bottom">

                

                <LeaveRequests />

            </div>

          

        </>

    )}

   {activeSection === "employees" && (

    <EmployeeManagement />

)}

    {activeSection === "attendance" && (

    <AttendanceManagement/>

)}

    {activeSection === "leave" && (

       <LeaveManagement />

        

    )}

    {activeSection === "payroll" && (

        <AdminPayroll/>

    )}

    {activeSection === "tasks" && (

        <TaskManagement />

    )}

    {activeSection === "reports" && (

       <AdminReports onClose={() => setShowReports(false)} />

    )}

    {activeSection === "settings" && (

        <AdminSettings onClose={() => setActiveSection("dashboard")}/>

    )}

</main>
            {/* Add Employee Modal */}

            <AddEmployeeModal
                open={showAddEmployee}
                onClose={() => setShowAddEmployee(false)}
            />

            <AssignTaskModal
               open={showAssignTask}
               onClose={() => setShowAssignTask(false)}
            />

            <LeaveModal
               open={showLeave}
               onClose={() => setShowLeave(false)}
            />

           {activeSection === "payroll" && (

            <AdminPayroll
            onClose={() => setActiveSection("dashboard")} />

             )}

            <ReportsModal
                open={showReports}
                onClose={() => setShowReports(false)}
            />

        </div>

    );

}

export default AdminDashboard;