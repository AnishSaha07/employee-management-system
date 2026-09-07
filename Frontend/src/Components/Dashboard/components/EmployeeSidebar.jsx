import "./EmployeeSidebar.css";
import { useAttendance } from "../../../context/AttendenceContext";
import { useNavigate } from "react-router-dom";

import {
    FaHome,
    FaCalendarCheck,
    FaClipboardList,
    FaUmbrellaBeach,
    FaMoneyBillWave,
    FaUser,
    FaCog,
    FaSignOutAlt,
} from "react-icons/fa";

import { getCurrentUser, logout } from "../../../utils/auth";

const EmployeeSidebar = ({
    activeSection,
    setActiveSection,
}) => {

    const navigate = useNavigate();

    const currentUser = getCurrentUser();

    const { checkOut } = useAttendance();

    const menuItems = [

        {
            id: "dashboard",
            title: "Dashboard",
            icon: <FaHome />,
        },

        {
            id: "attendance",
            title: "Attendance",
            icon: <FaCalendarCheck />,
        },

        {
            id: "tasks",
            title: "Tasks",
            icon: <FaClipboardList />,
        },

        {
            id: "leave",
            title: "Leave",
            icon: <FaUmbrellaBeach />,
        },

        {
            id: "payroll",
            title: "Payroll",
            icon: <FaMoneyBillWave />,
        },

        {
            id: "profile",
            title: "My Profile",
            icon: <FaUser />,
        },

        {
            id: "settings",
            title: "Settings",
            icon: <FaCog />,
        },

    ];

    const handleLogout = () => {

    if (!currentUser) {
        logout();
        navigate("/login");
        return;
    }

    // Checkout today's attendance
    checkOut(currentUser.employeeId);

    // Logout
    logout();

    // Redirect
    navigate("/login");

};

    return (

        <aside className="employee-sidebar">

            <div className="sidebar-top">

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

                <nav className="sidebar-menu">

                    {

                        menuItems.map((item) => (

                            <button

                                key={item.id}

                                className={

                                    activeSection === item.id

                                        ? "menu-item active"

                                        : "menu-item"

                                }

                                onClick={() =>

                                    setActiveSection(item.id)

                                }

                            >

                                <span className="menu-icon">

                                    {item.icon}

                                </span>

                                <span>

                                    {item.title}

                                </span>

                            </button>

                        ))

                    }

                </nav>

            </div>

            <div className="sidebar-bottom">

                <div className="employee-profile">

                    <div className="employee-avatar">

                        {

                            currentUser?.name

                                ?.split(" ")

                                .map(word => word[0])

                                .join("")

                                .toUpperCase()

                        }

                    </div>

                    <div>

                        <h4>{currentUser?.name}</h4>

                        <p>

                            {currentUser?.designation || "Employee"}

                        </p>

                        <span className="online">

                            ● Online

                        </span>

                    </div>

                </div>

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

export default EmployeeSidebar;