import { useState } from "react";

import "./ChangePasswordModal.css";

import Modal from "../../../common/Modal";

import { useEmployees } from "../../../context/EmployeeContext";
import { useToast } from "../../../context/ToastContext";
import { getCurrentUser } from "../../../utils/auth";


const ChangePasswordModal = ({
    open,
    onClose,
}) => {

    const {
        employees,
        updateEmployee,
    } = useEmployees();

    const {
        showToast,
    } = useToast();


    /* ===========================
            FORM STATE
    =========================== */

    const [formData, setFormData] = useState({

        currentPassword: "",

        newPassword: "",

        confirmPassword: "",

    });


    /* ===========================
            PASSWORD VISIBILITY
    =========================== */

    const [showPassword, setShowPassword] = useState({

        current: false,

        new: false,

        confirm: false,

    });


    /* ===========================
            HANDLE CHANGE
    =========================== */

    const handleChange = (e) => {

        const {
            name,
            value,
        } = e.target;


        setFormData((prev) => ({

            ...prev,

            [name]: value,

        }));

    };


    /* ===========================
            TOGGLE PASSWORD
    =========================== */

    const togglePassword = (field) => {

        setShowPassword((prev) => ({

            ...prev,

            [field]: !prev[field],

        }));

    };


    /* ===========================
            RESET FORM
    =========================== */

    const resetForm = () => {

        setFormData({

            currentPassword: "",

            newPassword: "",

            confirmPassword: "",

        });


        setShowPassword({

            current: false,

            new: false,

            confirm: false,

        });

    };


    /* ===========================
            CLOSE
    =========================== */

    const handleClose = () => {

        resetForm();

        onClose();

    };


    /* ===========================
            SUBMIT
    =========================== */

    const handleSubmit = (e) => {

        e.preventDefault();


        /* ===========================
                CURRENT USER
        =========================== */

        const currentUser =
            getCurrentUser();


        if (!currentUser) {

            showToast(
                "error",
                "Session Error",
                "Please login again."
            );

            return;

        }


        /* ===========================
                FIND ACCOUNT
        =========================== */

        const employee =
            employees.find(

                (emp) =>
                    emp.employeeId ===
                    currentUser.employeeId

            );


        if (!employee) {

            showToast(
                "error",
                "Account Not Found",
                "Unable to find your account."
            );

            return;

        }


        /* ===========================
                CURRENT PASSWORD
        =========================== */

        if (
            formData.currentPassword !==
            employee.password
        ) {

            showToast(
                "error",
                "Incorrect Password",
                "Your current password is incorrect."
            );

            return;

        }


        /* ===========================
                NEW PASSWORD LENGTH
        =========================== */

        if (
            formData.newPassword.length < 6
        ) {

            showToast(
                "error",
                "Weak Password",
                "New password must contain at least 6 characters."
            );

            return;

        }


        /* ===========================
                PASSWORD MATCH
        =========================== */

        if (
            formData.newPassword !==
            formData.confirmPassword
        ) {

            showToast(
                "error",
                "Password Mismatch",
                "New passwords do not match."
            );

            return;

        }


        /* ===========================
                SAME PASSWORD
        =========================== */

        if (
            formData.currentPassword ===
            formData.newPassword
        ) {

            showToast(
                "error",
                "Invalid Password",
                "New password must be different from your current password."
            );

            return;

        }


        /* ===========================
                UPDATE EMPLOYEE
        =========================== */

        const updatedEmployee = {

            ...employee,

            password:
                formData.newPassword,

        };


        updateEmployee(
            updatedEmployee
        );


        /* ===========================
            UPDATE CURRENT SESSION
        =========================== */

        const updatedCurrentUser = {

            ...currentUser,

            password:
                formData.newPassword,

        };


        /*
         * Detect where the current
         * session is stored.
         */

        if (
            localStorage.getItem(
                "currentUser"
            )
        ) {

            localStorage.setItem(

                "currentUser",

                JSON.stringify(
                    updatedCurrentUser
                )

            );

        } else {

            sessionStorage.setItem(

                "currentUser",

                JSON.stringify(
                    updatedCurrentUser
                )

            );

        }


        /* ===========================
                SUCCESS
        =========================== */

        showToast(
            "success",
            "Password Updated",
            "Your password has been changed successfully."
        );


        handleClose();

    };


    return (

        <Modal

            open={open}

            title="Change Password"

            onClose={handleClose}

        >

            <form
                className="change-password-form"
                onSubmit={handleSubmit}
            >


                {/* ===========================
                        INFORMATION
                =========================== */}

                <div className="password-info">

                    <h4>
                        Update your password
                    </h4>

                    <p>

                        Use a strong password with at least
                        6 characters to keep your account secure.

                    </p>

                </div>


                {/* ===========================
                        CURRENT PASSWORD
                =========================== */}

                <div className="password-field">

                    <label>
                        Current Password
                    </label>


                    <div className="password-input">

                        <input

                            type={
                                showPassword.current
                                    ? "text"
                                    : "password"
                            }

                            name="currentPassword"

                            value={
                                formData.currentPassword
                            }

                            onChange={
                                handleChange
                            }

                            placeholder="Enter current password"

                            required

                        />


                        <button

                            type="button"

                            onClick={() =>
                                togglePassword(
                                    "current"
                                )
                            }

                        >

                            {
                                showPassword.current
                                    ? "Hide"
                                    : "Show"
                            }

                        </button>

                    </div>

                </div>


                {/* ===========================
                        NEW PASSWORD
                =========================== */}

                <div className="password-field">

                    <label>
                        New Password
                    </label>


                    <div className="password-input">

                        <input

                            type={
                                showPassword.new
                                    ? "text"
                                    : "password"
                            }

                            name="newPassword"

                            value={
                                formData.newPassword
                            }

                            onChange={
                                handleChange
                            }

                            placeholder="Enter new password"

                            minLength="6"

                            required

                        />


                        <button

                            type="button"

                            onClick={() =>
                                togglePassword(
                                    "new"
                                )
                            }

                        >

                            {
                                showPassword.new
                                    ? "Hide"
                                    : "Show"
                            }

                        </button>

                    </div>

                </div>


                {/* ===========================
                        CONFIRM PASSWORD
                =========================== */}

                <div className="password-field">

                    <label>
                        Confirm New Password
                    </label>


                    <div className="password-input">

                        <input

                            type={
                                showPassword.confirm
                                    ? "text"
                                    : "password"
                            }

                            name="confirmPassword"

                            value={
                                formData.confirmPassword
                            }

                            onChange={
                                handleChange
                            }

                            placeholder="Confirm new password"

                            minLength="6"

                            required

                        />


                        <button

                            type="button"

                            onClick={() =>
                                togglePassword(
                                    "confirm"
                                )
                            }

                        >

                            {
                                showPassword.confirm
                                    ? "Hide"
                                    : "Show"
                            }

                        </button>

                    </div>

                </div>


                {/* ===========================
                        BUTTONS
                =========================== */}

                <div className="password-actions">


                    <button

                        type="button"

                        className="password-cancel-btn"

                        onClick={
                            handleClose
                        }

                    >

                        Cancel

                    </button>


                    <button

                        type="submit"

                        className="password-save-btn"

                    >

                        Change Password

                    </button>

                </div>


            </form>

        </Modal>

    );

};


export default ChangePasswordModal;