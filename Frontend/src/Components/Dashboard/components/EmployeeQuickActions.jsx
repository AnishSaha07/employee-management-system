import "./Card.css";

import {

    FaClock,

    FaTasks,

    FaCalendarAlt,

    FaUser,

} from "react-icons/fa";

const EmployeeQuickActions = ({
    setActiveSection,
}) => {

    const actions = [

        {
            id: 1,
            title: "Attendance",
            icon: <FaClock />,
            color: "#2563eb",
            section: "attendance",
        },

        {
            id: 2,
            title: "My Tasks",
            icon: <FaTasks />,
            color: "#22c55e",
            section: "tasks",
        },

        {
            id: 3,
            title: "Apply Leave",
            icon: <FaCalendarAlt />,
            color: "#f59e0b",
            section: "leave",
        },

        {
            id: 4,
            title: "My Profile",
            icon: <FaUser />,
            color: "#8b5cf6",
            section: "profile",
        },

    ];

    return (

        <div className="dashboard-card">

            <h3>

                Quick Actions

            </h3>

            <div className="employee-actions-grid">

                {

                    actions.map((action) => (

                        <button

                            key={action.id}

                            className="employee-action-card"

                            onClick={() =>

                                setActiveSection(action.section)

                            }

                        >

                            <div

                                className="employee-action-icon"

                                style={{

                                    backgroundColor: action.color,

                                }}

                            >

                                {action.icon}

                            </div>

                            <span>

                                {action.title}

                            </span>

                        </button>

                    ))

                }

            </div>

        </div>

    );

};

export default EmployeeQuickActions;