import React from "react";
import "./QuickActions.css";

import {
  FaUserPlus,
  FaClipboardList,
  FaMoneyBillWave,
  FaCalendarCheck,
  FaChartBar,
} from "react-icons/fa";

const QuickActions = ({ onAddEmployee, onAssignTask, onManageLeave,onPayroll,onReports, }) => {

  const actions = [

    {
      title: "Add Employee",
      description: "Create a new employee account",
      icon: <FaUserPlus />,
      color: "blue",
      onClick: onAddEmployee,
    },

    {
      title: "Assign Task",
      description: "Assign work to employees",
      icon: <FaClipboardList />,
      color: "purple",
      onClick: onAssignTask,
    },

    {
    title: "Manage Leave",
    description: "Review employee leave requests",
    icon: <FaCalendarCheck />,
    color: "orange",
    onClick: onManageLeave,
    },

    {
    title: "Payroll",
    description: "Generate monthly payroll",
    icon: <FaMoneyBillWave />,
    color: "green",
    onClick: onPayroll,
    },

    {
      title: "Reports",
      description: "View organization reports",
      icon: <FaChartBar />,
      color: "cyan",
      onClick: onReports,
    },

  ];

  return (

    <section className="quick-actions">

      <div className="section-header">

        <h2>Quick Actions</h2>

        <p>Frequently used HR operations</p>

      </div>

      <div className="actions-grid">

        {actions.map((action, index) => (

          <button
            key={index}
            className="action-card"
            onClick={action.onClick}
          >

            <div className={`action-icon ${action.color}`}>

              {action.icon}

            </div>

            <h3>{action.title}</h3>

            <p>{action.description}</p>

          </button>

        ))}

      </div>

    </section>

  );

};

export default QuickActions;