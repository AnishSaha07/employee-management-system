import React from "react";
import "./Topbar.css";

import {
  FaBell,
  FaSearch,
  FaChevronDown
} from "react-icons/fa";

import { getCurrentUser } from "../../../utils/auth";

const Topbar = () => {

  const user = getCurrentUser();

  const firstName = user?.name?.split(" ")[0] || "Admin";

  const hours = new Date().getHours();

  let greeting = "";

  if (hours < 12) {
    greeting = "Good Morning";
  } else if (hours < 17) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }

  const initials = user?.name
    ?.split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (

    <header className="topbar">

      {/* LEFT */}

      <div className="topbar-left">

        <h1>

          {greeting}, {firstName} 👋

        </h1>

        <p>

          Welcome back to AS GROUP Employee Management System.

        </p>

      </div>

      {/* RIGHT */}

      <div className="topbar-right">

        {/* SEARCH */}

        <div className="search-box">

          <FaSearch />

          <input
            type="text"
            placeholder="Search employee..."
          />

        </div>

        {/* NOTIFICATION */}

        <button className="notification-btn">

          <FaBell />

          <span className="notification-dot"></span>

        </button>

        {/* PROFILE */}

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

          <FaChevronDown className="arrow" />

        </div>

      </div>

    </header>

  );

};

export default Topbar;