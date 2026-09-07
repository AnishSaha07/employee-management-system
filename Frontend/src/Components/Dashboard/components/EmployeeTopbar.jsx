import React from "react";
import "./EmployeeTopbar.css";

import {
    FaBell,
    FaSearch,
    FaChevronDown,
    FaCalendarAlt,
} from "react-icons/fa";

import { getCurrentUser } from "../../../utils/auth";

const EmployeeTopbar = () => {

    const user = getCurrentUser();

    const firstName =
        user?.name?.split(" ")[0] || "Employee";

    const hours = new Date().getHours();

    let greeting = "Good Evening";

    if (hours < 12) greeting = "Good Morning";
    else if (hours < 17) greeting = "Good Afternoon";

    const initials = user?.name
        ?.split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase();

    const today = new Date().toLocaleDateString("en-IN", {

        weekday: "long",

        day: "numeric",

        month: "long",

        year: "numeric",

    });

    return (

        <header className="topbar">

            {/* LEFT */}

            <div className="topbar-left">

                <h1>

                    {greeting},

                    <span>{firstName}</span>

                    👋

                </h1>

                <div className="topbar-date">

                    <FaCalendarAlt />

                    <span>{today}</span>

                </div>

            </div>

            {/* RIGHT */}

            <div className="topbar-right">

                <div className="search-box">

                    <FaSearch />

                    <input
                        type="text"
                        placeholder="Search..."
                    />

                </div>

                <button className="notification-btn">

                    <FaBell />

                    <span className="notification-dot"></span>

                </button>

                <div className="profile-menu">

                    <div className="profile-circle">

                        {initials}

                    </div>

                    <div className="profile-text">

                        <h4>

                            {user?.name}

                        </h4>

                        <p>

                            {user?.designation}

                        </p>

                    </div>

                    <FaChevronDown className="arrow"/>

                </div>

            </div>

        </header>

    );

};

export default EmployeeTopbar;