import React from "react";
import "./Sidebar.css";
import { useNavigate } from "react-router-dom";

import {
  FaHome,
  FaUsers,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaClipboardList,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

import { getCurrentUser, logout } from "../../../utils/auth";

const Sidebar = ({ activeSection, setActiveSection }) => {

  const navigate = useNavigate();

  const user = getCurrentUser();

  const initials = user?.name
    ?.split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    {
      id: "dashboard",
      name: "Dashboard",
      icon: <FaHome />,
    },
    {
      id: "employees",
      name: "Employees",
      icon: <FaUsers />,
    },
    {
      id: "attendance",
      name: "Attendance",
      icon: <FaCalendarAlt />,
    },
    {
      id: "leave",
      name: "Leave Management",
      icon: <FaClipboardList />,
    },
    {
      id: "payroll",
      name: "Payroll",
      icon: <FaMoneyBillWave />,
    },
    {
      id: "tasks",
      name: "Tasks",
      icon: <FaClipboardList />,
    },
    {
      id: "reports",
      name: "Reports",
      icon: <FaChartBar />,
    },
    {
      id: "settings",
      name: "Settings",
      icon: <FaCog />,
    },
  ];

  return (

    <aside className="sidebar">

      <div className="sidebar-top">

        {/* ================= LOGO ================= */}

        <div className="sidebar-logo">

          <div className="sidebar-logo-box">

            <span className="logo-a">A</span>
            <span className="logo-s">S</span>

          </div>

          <div className="sidebar-logo-text">

            <h2>AS GROUP</h2>

            <p>Employee Management</p>

          </div>

        </div>

        {/* ================= MENU ================= */}

        <nav className="sidebar-menu">

          {menuItems.map((item) => (

            <button
              key={item.id}
              className={`menu-item ${activeSection === item.id ? "active" : ""}`}
              onClick={() => setActiveSection(item.id)}
            >

              {item.icon}

              <span>{item.name}</span>

            </button>

          ))}

        </nav>

      </div>

      {/* ================= PROFILE ================= */}

      <div className="sidebar-bottom">

        <div className="sidebar-profile">

          <div className="profile-avatar">

            {initials}

          </div>

          <div className="profile-details">

            <h4>{user?.name}</h4>

            <p>{user?.designation}</p>

            <span className="online">

              ● Online

            </span>

          </div>

        </div>

        {/* ================= LOGOUT ================= */}

        <button
          className="logout-btn"
          onClick={handleLogout}
        >

          <FaSignOutAlt />

          Logout

        </button>

      </div>

    </aside>

  );

};

export default Sidebar;