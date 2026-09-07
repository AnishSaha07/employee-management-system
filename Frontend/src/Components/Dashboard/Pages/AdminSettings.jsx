import { useEffect, useState } from "react";

import "./AdminSettings.css";

import {
    FaUser,
    FaLock,
    FaBell,
    FaShieldAlt,
    FaCog,
    FaSignOutAlt,
    FaToggleOn,
    FaToggleOff,
    FaMapMarkerAlt,
    FaLocationArrow,
    FaSave,
} from "react-icons/fa";

import {
    getCurrentUser,
    logout,
} from "../../../utils/auth";

import api from "../../../services/api";

import ChangePasswordModal
    from "../Modals/ChangePasswordModal";

import AnnouncementManagement
    from "./AnnouncementManagement";


const AdminSettings = ({ onClose }) => {

    const currentUser = getCurrentUser();


    /* ===========================
            CHANGE PASSWORD
    =========================== */

    const [
        showChangePassword,
        setShowChangePassword,
    ] = useState(false);


    /* ===========================
            NOTIFICATIONS
    =========================== */

    const [
        notifications,
        setNotifications,
    ] = useState({

        leave: true,

        task: true,

        payroll: true,

    });


    /* ===========================
            PREFERENCES
    =========================== */

    const [
        preferences,
        setPreferences,
    ] = useState({

        compactMode: false,

        emailNotifications: true,

    });


    /* ===========================
            ATTENDANCE LOCATION
    =========================== */

    const [
        attendanceLocation,
        setAttendanceLocation,
    ] = useState({

        officeName: "",

        latitude: "",

        longitude: "",

        radius: 200,

    });


    const [
        locationLoading,
        setLocationLoading,
    ] = useState(true);


    const [
        locationSaving,
        setLocationSaving,
    ] = useState(false);


    const [
        locationError,
        setLocationError,
    ] = useState("");


    const [
        locationSuccess,
        setLocationSuccess,
    ] = useState("");


    /* ===========================
        LOAD SAVED LOCATION
    =========================== */

    useEffect(() => {

        let cancelled = false;


        const loadAttendanceLocation = async () => {

            try {

                setLocationLoading(true);

                setLocationError("");

                const response = await api.get(
                    "/settings/attendance"
                );


                if (cancelled) {
                    return;
                }


                const location =
                    response.data?.settings?.officeLocation ||
                    response.data?.officeLocation ||
                    response.data?.settings ||
                    {};


                setAttendanceLocation({

                    officeName:
                        location.officeName ||
                        location.name ||
                        "",

                    latitude:
                        location.latitude ??
                        "",

                    longitude:
                        location.longitude ??
                        "",

                    radius:
                        location.radius ??
                        200,

                });

            } catch (error) {

                if (cancelled) {
                    return;
                }


                console.error(
                    "Load attendance location error:",
                    error
                );


                setLocationError(
                    error.response?.data?.message ||
                    "Failed to load attendance location."
                );

            } finally {

                if (!cancelled) {
                    setLocationLoading(false);
                }

            }

        };


        loadAttendanceLocation();


        return () => {

            cancelled = true;

        };

    }, []);


    /* ===========================
        LOCATION INPUT CHANGE
    =========================== */

    const handleLocationChange = (event) => {

        const {
            name,
            value,
        } = event.target;


        setAttendanceLocation(
            (prev) => ({

                ...prev,

                [name]: value,

            })
        );

    };


    /* ===========================
        GET CURRENT GPS LOCATION
    =========================== */

    const handleUseCurrentLocation = () => {

        setLocationError("");

        setLocationSuccess("");


        if (!navigator.geolocation) {

            setLocationError(
                "Geolocation is not supported by this browser."
            );

            return;

        }


        setLocationLoading(true);


        navigator.geolocation.getCurrentPosition(

            (position) => {

                const {
                    latitude,
                    longitude,
                } = position.coords;


                setAttendanceLocation(
                    (prev) => ({

                        ...prev,

                        latitude:
                            latitude.toFixed(6),

                        longitude:
                            longitude.toFixed(6),

                    })
                );


                setLocationLoading(false);


                setLocationSuccess(
                    "Current location detected. Click Save Attendance Location to save it."
                );

            },

            (error) => {

                console.error(
                    "Admin GPS error:",
                    error
                );


                let message =
                    "Unable to get your current location.";


                if (error.code === 1) {

                    message =
                        "Location permission was denied. Please allow location access in your browser.";

                } else if (error.code === 2) {

                    message =
                        "Your current location could not be determined.";

                } else if (error.code === 3) {

                    message =
                        "Location request timed out. Please try again.";

                }


                setLocationError(message);

                setLocationLoading(false);

            },

            {
                enableHighAccuracy: true,

                timeout: 15000,

                maximumAge: 0,

            }

        );

    };


    /* ===========================
            SAVE LOCATION
    =========================== */

    const handleSaveAttendanceLocation = async (
        event
    ) => {

        event.preventDefault();


        setLocationError("");

        setLocationSuccess("");


        const latitude =
            Number(
                attendanceLocation.latitude
            );

        const longitude =
            Number(
                attendanceLocation.longitude
            );

        const radius =
            Number(
                attendanceLocation.radius
            );


        /* ===========================
            VALIDATION
        =========================== */

        if (
            !attendanceLocation.officeName.trim()
        ) {

            setLocationError(
                "Please enter the office name."
            );

            return;

        }


        if (
            !Number.isFinite(latitude) ||
            latitude < -90 ||
            latitude > 90
        ) {

            setLocationError(
                "Please enter a valid latitude."
            );

            return;

        }


        if (
            !Number.isFinite(longitude) ||
            longitude < -180 ||
            longitude > 180
        ) {

            setLocationError(
                "Please enter a valid longitude."
            );

            return;

        }


        if (
            !Number.isFinite(radius) ||
            radius <= 0
        ) {

            setLocationError(
                "Attendance radius must be greater than 0 meters."
            );

            return;

        }


        try {

            setLocationSaving(true);


            const response = await api.put(
                "/settings/attendance",
                {

                    officeName:
                        attendanceLocation.officeName.trim(),

                    latitude,

                    longitude,

                    radius,

                }
            );


            const savedLocation =
                response.data?.settings?.officeLocation ||
                response.data?.officeLocation;


            if (savedLocation) {

                setAttendanceLocation(
                    (prev) => ({

                        ...prev,

                        officeName:
                            savedLocation.officeName ??
                            savedLocation.name ??
                            prev.officeName,

                        latitude:
                            savedLocation.latitude ??
                            prev.latitude,

                        longitude:
                            savedLocation.longitude ??
                            prev.longitude,

                        radius:
                            savedLocation.radius ??
                            prev.radius,

                    })
                );

            }


            setLocationSuccess(
                response.data?.message ||
                "Attendance location saved successfully."
            );

        } catch (error) {

            console.error(
                "Save attendance location error:",
                error
            );


            setLocationError(
                error.response?.data?.message ||
                "Failed to save attendance location."
            );

        } finally {

            setLocationSaving(false);

        }

    };


    /* ===========================
                LOGOUT
    =========================== */

    const handleLogout = () => {

        logout();

        window.location.href = "/login";

    };


    return (

        <section className="admin-settings">


            {/* =================================
                    HEADER
            ================================= */}

            <div className="admin-settings-header">

                <div>

                    <h2>
                        Settings
                    </h2>

                    <p>
                        Manage your account and system preferences.
                    </p>

                </div>


                {onClose && (

                    <button
                        type="button"
                        className="settings-close-btn"
                        onClick={onClose}
                    >

                        <span className="settings-close-icon">
                            ×
                        </span>

                        <span>
                            Close
                        </span>

                    </button>

                )}

            </div>


            {/* =================================
                ATTENDANCE LOCATION
            ================================= */}

            <div className="settings-card attendance-location-card">

                <div className="settings-card-header">

                    <div className="settings-icon blue">

                        <FaMapMarkerAlt />

                    </div>


                    <div>

                        <h3>
                            Attendance Location
                        </h3>

                        <p>
                            Configure the authorized workplace for employee attendance.
                        </p>

                    </div>

                </div>


                {/* =============================
                        LOCATION ERROR
                ============================= */}

                {locationError && (

                    <div className="settings-location-error">

                        {locationError}

                    </div>

                )}


                {/* =============================
                        LOCATION SUCCESS
                ============================= */}

                {locationSuccess && (

                    <div className="settings-location-success">

                        {locationSuccess}

                    </div>

                )}


                <form
                    className="attendance-location-form"
                    onSubmit={handleSaveAttendanceLocation}
                >


                    {/* OFFICE NAME */}

                    <div className="settings-form-group">

                        <label htmlFor="officeName">

                            Office / Workplace Name

                        </label>


                        <input
                            id="officeName"
                            name="officeName"
                            type="text"
                            value={
                                attendanceLocation.officeName
                            }
                            onChange={
                                handleLocationChange
                            }
                            placeholder="AS Group Head Office"
                            disabled={locationLoading}
                        />

                    </div>


                    {/* GPS BUTTON */}

                    <div className="current-location-box">

                        <div>

                            <strong>
                                Set workplace location
                            </strong>

                            <p>
                                Use the admin's current GPS location as the authorized attendance location.
                            </p>

                        </div>


                        <button
                            type="button"
                            className="use-location-btn"
                            onClick={
                                handleUseCurrentLocation
                            }
                            disabled={locationLoading}
                        >

                            <FaLocationArrow />

                            {locationLoading
                                ? "Getting Location..."
                                : "Use Current Location"
                            }

                        </button>

                    </div>


                    {/* COORDINATES */}

                    <div className="location-coordinate-grid">


                        {/* LATITUDE */}

                        <div className="settings-form-group">

                            <label htmlFor="latitude">

                                Latitude

                            </label>


                            <input
                                id="latitude"
                                name="latitude"
                                type="number"
                                step="any"
                                value={
                                    attendanceLocation.latitude
                                }
                                onChange={
                                    handleLocationChange
                                }
                                placeholder="22.5726"
                            />

                        </div>


                        {/* LONGITUDE */}

                        <div className="settings-form-group">

                            <label htmlFor="longitude">

                                Longitude

                            </label>


                            <input
                                id="longitude"
                                name="longitude"
                                type="number"
                                step="any"
                                value={
                                    attendanceLocation.longitude
                                }
                                onChange={
                                    handleLocationChange
                                }
                                placeholder="88.3639"
                            />

                        </div>

                    </div>


                    {/* RADIUS */}

                    <div className="settings-form-group">

                        <label htmlFor="radius">

                            Allowed Attendance Radius

                        </label>


                        <div className="radius-input-wrapper">

                            <input
                                id="radius"
                                name="radius"
                                type="number"
                                min="10"
                                step="10"
                                value={
                                    attendanceLocation.radius
                                }
                                onChange={
                                    handleLocationChange
                                }
                                placeholder="200"
                            />

                            <span>
                                meters
                            </span>

                        </div>


                        <small className="settings-help-text">

                            Employees can check in only when their current GPS location is within this radius.

                        </small>

                    </div>


                    {/* LOCATION PREVIEW */}

                    <div className="location-preview">

                        <div className="location-preview-icon">

                            <FaMapMarkerAlt />

                        </div>


                        <div>

                            <strong>
                                Authorized Attendance Area
                            </strong>

                            <p>

                                {attendanceLocation.latitude &&
                                attendanceLocation.longitude

                                    ? `${attendanceLocation.latitude}, ${attendanceLocation.longitude} • ${attendanceLocation.radius}m radius`

                                    : "No attendance location configured yet."
                                }

                            </p>

                        </div>

                    </div>


                    {/* SAVE BUTTON */}

                    <div className="location-save-row">

                        <button
                            type="submit"
                            className="save-location-btn"
                            disabled={
                                locationSaving ||
                                locationLoading
                            }
                        >

                            <FaSave />

                            {locationSaving
                                ? "Saving..."
                                : "Save Attendance Location"
                            }

                        </button>

                    </div>

                </form>

            </div>


            {/* =================================
                    ACCOUNT INFORMATION
            ================================= */}

            <div className="settings-card">

                <div className="settings-card-header">

                    <div className="settings-icon blue">

                        <FaUser />

                    </div>


                    <div>

                        <h3>
                            Account Information
                        </h3>

                        <p>
                            Your administrator account details.
                        </p>

                    </div>

                </div>


                <div className="settings-info-grid">


                    <div>

                        <span>
                            Full Name
                        </span>

                        <strong>
                            {currentUser?.name || "--"}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Email
                        </span>

                        <strong>
                            {currentUser?.email || "--"}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Employee ID
                        </span>

                        <strong>
                            {currentUser?.employeeId || "--"}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Role
                        </span>

                        <strong>
                            Administrator
                        </strong>

                    </div>

                </div>

            </div>


            {/* =================================
                    SECURITY
            ================================= */}

            <div className="settings-two-column">


                {/* CHANGE PASSWORD */}

                <div className="settings-card">

                    <div className="settings-card-header">

                        <div className="settings-icon purple">

                            <FaLock />

                        </div>


                        <div>

                            <h3>
                                Change Password
                            </h3>

                            <p>
                                Update your administrator password.
                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        className="settings-action-btn"
                        onClick={() =>
                            setShowChangePassword(true)
                        }
                    >

                        <FaLock />

                        Change Password

                    </button>

                </div>


                {/* SECURITY */}

                <div className="settings-card">

                    <div className="settings-card-header">

                        <div className="settings-icon green">

                            <FaShieldAlt />

                        </div>


                        <div>

                            <h3>
                                Security
                            </h3>

                            <p>
                                Manage your account security.
                            </p>

                        </div>

                    </div>


                    <div className="security-status">

                        <span className="security-dot"></span>

                        <div>

                            <strong>
                                Account Secure
                            </strong>

                            <p>
                                Your administrator session is active.
                            </p>

                        </div>

                    </div>

                </div>

            </div>


            {/* =================================
                    NOTIFICATIONS
            ================================= */}

            <div className="settings-card">

                <div className="settings-card-header">

                    <div className="settings-icon orange">

                        <FaBell />

                    </div>


                    <div>

                        <h3>
                            Notification Preferences
                        </h3>

                        <p>
                            Choose which events should notify you.
                        </p>

                    </div>

                </div>


                <div className="settings-options">


                    <div className="settings-option">

                        <div>

                            <strong>
                                Leave Requests
                            </strong>

                            <p>
                                Notify me when an employee submits leave.
                            </p>

                        </div>


                        <button
                            type="button"
                            className="toggle-btn"
                            onClick={() =>
                                setNotifications(
                                    (prev) => ({

                                        ...prev,

                                        leave:
                                            !prev.leave,

                                    })
                                )
                            }
                        >

                            {notifications.leave
                                ? <FaToggleOn />
                                : <FaToggleOff />
                            }

                        </button>

                    </div>


                    <div className="settings-option">

                        <div>

                            <strong>
                                Task Updates
                            </strong>

                            <p>
                                Notify me about employee task updates.
                            </p>

                        </div>


                        <button
                            type="button"
                            className="toggle-btn"
                            onClick={() =>
                                setNotifications(
                                    (prev) => ({

                                        ...prev,

                                        task:
                                            !prev.task,

                                    })
                                )
                            }
                        >

                            {notifications.task
                                ? <FaToggleOn />
                                : <FaToggleOff />
                            }

                        </button>

                    </div>


                    <div className="settings-option">

                        <div>

                            <strong>
                                Payroll
                            </strong>

                            <p>
                                Notify me about payroll generation.
                            </p>

                        </div>


                        <button
                            type="button"
                            className="toggle-btn"
                            onClick={() =>
                                setNotifications(
                                    (prev) => ({

                                        ...prev,

                                        payroll:
                                            !prev.payroll,

                                    })
                                )
                            }
                        >

                            {notifications.payroll
                                ? <FaToggleOn />
                                : <FaToggleOff />
                            }

                        </button>

                    </div>

                </div>

            </div>


            {/* =================================
                ACCOUNT PREFERENCES
            ================================= */}

            <div className="settings-card">

                <div className="settings-card-header">

                    <div className="settings-icon gray">

                        <FaCog />

                    </div>


                    <div>

                        <h3>
                            Account Preferences
                        </h3>

                        <p>
                            Customize your dashboard experience.
                        </p>

                    </div>

                </div>


                <div className="settings-options">


                    <div className="settings-option">

                        <div>

                            <strong>
                                Compact Dashboard
                            </strong>

                            <p>
                                Use a more compact dashboard layout.
                            </p>

                        </div>


                        <button
                            type="button"
                            className="toggle-btn"
                            onClick={() =>
                                setPreferences(
                                    (prev) => ({

                                        ...prev,

                                        compactMode:
                                            !prev.compactMode,

                                    })
                                )
                            }
                        >

                            {preferences.compactMode
                                ? <FaToggleOn />
                                : <FaToggleOff />
                            }

                        </button>

                    </div>


                    <div className="settings-option">

                        <div>

                            <strong>
                                Email Notifications
                            </strong>

                            <p>
                                Receive important system notifications.
                            </p>

                        </div>


                        <button
                            type="button"
                            className="toggle-btn"
                            onClick={() =>
                                setPreferences(
                                    (prev) => ({

                                        ...prev,

                                        emailNotifications:
                                            !prev.emailNotifications,

                                    })
                                )
                            }
                        >

                            {preferences.emailNotifications
                                ? <FaToggleOn />
                                : <FaToggleOff />
                            }

                        </button>

                    </div>

                </div>

            </div>


            {/* =================================
                EMPLOYEE ANNOUNCEMENTS
            ================================= */}

            <AnnouncementManagement />


            {/* =================================
                    LOGOUT
            ================================= */}

            <div className="settings-danger-card">

                <div>

                    <h3>
                        Logout
                    </h3>

                    <p>
                        Sign out of the administrator account.
                    </p>

                </div>


                <button
                    type="button"
                    className="settings-logout-btn"
                    onClick={handleLogout}
                >

                    <FaSignOutAlt />

                    Logout

                </button>

            </div>


            {/* =================================
                CHANGE PASSWORD MODAL
            ================================= */}

            <ChangePasswordModal

                open={showChangePassword}

                onClose={() =>
                    setShowChangePassword(false)
                }

            />

        </section>

    );

};


export default AdminSettings;