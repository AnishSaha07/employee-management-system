import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./EmployeeSettings.css";

import {
    FaLock,
    FaBell,
    FaShieldAlt,
    FaUserCog,
    FaSignOutAlt,
    FaChevronRight,
} from "react-icons/fa";

import ChangePasswordModal from "../Modals/ChangePasswordModal";

import {
    getCurrentUser,
    logout,
} from "../../../utils/auth";

import {
    useAttendance,
} from "../../../context/AttendenceContext";

const EmployeeSettings = () => {

    const navigate = useNavigate();

    const currentUser = getCurrentUser();

    const { checkOut } = useAttendance();

    const [showPasswordModal, setShowPasswordModal] =
        useState(false);

    /* =================================
            LOGOUT + CHECKOUT
    ================================= */

    const handleLogout = () => {

        if (!currentUser) {

            logout();

            navigate("/login");

            return;

        }

        // Checkout today's attendance
        checkOut(currentUser.employeeId);

        // Logout user
        logout();

        // Redirect to login
        navigate("/login");

    };

    /* =================================
            SETTINGS ITEMS
    ================================= */

    const settingsItems = [

        {
            id: "password",

            icon: <FaLock />,

            title: "Change Password",

            description:
                "Update your account password to keep your account secure.",

            action: () => setShowPasswordModal(true),

            type: "normal",

        },

        {
            id: "notifications",

            icon: <FaBell />,

            title: "Notification Preferences",

            description:
                "Manage how you receive notifications and alerts.",

            action: () => {},

            type: "normal",

        },

        {
            id: "security",

            icon: <FaShieldAlt />,

            title: "Security",

            description:
                "Manage your account security and login preferences.",

            action: () => {},

            type: "normal",

        },

        {
            id: "preferences",

            icon: <FaUserCog />,

            title: "Account Preferences",

            description:
                "Manage your personal account preferences.",

            action: () => {},

            type: "normal",

        },

        {
            id: "logout",

            icon: <FaSignOutAlt />,

            title: "Logout",

            description:
                "Check out from attendance and securely sign out of your account.",

            action: handleLogout,

            type: "logout",

        },

    ];

    return (

        <section className="employee-settings-page">

            {/* =================================
                    PAGE HEADER
            ================================= */}

            <div className="employee-page-header">

                <div>

                    <h2>

                        Settings

                    </h2>

                    <p>

                        Manage your account and security preferences.

                    </p>

                </div>

            </div>


            {/* =================================
                    SETTINGS CARD
            ================================= */}

            <div className="settings-card">

                <div className="settings-card-header">

                    <h3>

                        Account Settings

                    </h3>

                    <p>

                        Configure your employee account.

                    </p>

                </div>


                <div className="settings-list">

                    {

                        settingsItems.map((item) => (

                            <button

                                key={item.id}

                                type="button"

                                className={`settings-item ${
                                    item.type === "logout"
                                        ? "settings-logout"
                                        : ""
                                }`}

                                onClick={item.action}

                            >

                                {/* ICON */}

                                <div className="settings-icon">

                                    {item.icon}

                                </div>


                                {/* INFORMATION */}

                                <div className="settings-info">

                                    <h4>

                                        {item.title}

                                    </h4>

                                    <p>

                                        {item.description}

                                    </p>

                                </div>


                                {/* ARROW */}

                                <FaChevronRight
                                    className="settings-arrow"
                                />

                            </button>

                        ))

                    }

                </div>

            </div>


            {/* =================================
                    SECURITY INFO
            ================================= */}

            <div className="security-info-card">

                <div className="security-info-icon">

                    <FaShieldAlt />

                </div>

                <div>

                    <h4>

                        Account Security

                    </h4>

                    <p>

                        Always log out after finishing your work.
                        Logging out from here will automatically record
                        your checkout time for today's attendance.

                    </p>

                </div>

            </div>


            {/* =================================
                    CHANGE PASSWORD MODAL
            ================================= */}

            <ChangePasswordModal

                open={showPasswordModal}

                onClose={() =>
                    setShowPasswordModal(false)
                }

            />

        </section>

    );

};

export default EmployeeSettings;