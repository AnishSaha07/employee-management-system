import React, { useState } from "react";
import "./Login.css";

import {
    FaEye,
    FaEyeSlash,
    FaLock,
    FaUser,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import { login } from "../../utils/auth";


const Login = () => {

    const navigate = useNavigate();


    const [identifier, setIdentifier] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [rememberMe, setRememberMe] =
        useState(false);

    const [showPassword, setShowPassword] =
        useState(false);

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [showMessage, setShowMessage] =
        useState(false);


    /* =====================================================
        LOGIN
    ===================================================== */

    const handleLogin = async (e) => {

        e.preventDefault();

        setError("");


        /* ===============================
            BASIC VALIDATION
        =============================== */

        if (!identifier.trim() || !password) {

            setError(
                "Please fill in all fields."
            );

            return;

        }


        try {

            setLoading(true);


            /* ===============================
                BACKEND LOGIN
            =============================== */

            const result = await login(
                identifier.trim(),
                password,
                rememberMe
            );


            /* ===============================
                SAFETY CHECK
            =============================== */

            if (
                !result ||
                !result.success ||
                !result.user
            ) {

                setError(
                    "Invalid Employee ID / Email or Password."
                );

                return;

            }


            const user = result.user;


            /* ===============================
                ROLE BASED REDIRECT
            =============================== */

            if (user.role === "admin") {

                navigate("/admin", {
                    replace: true,
                });

            } else {

                navigate("/employee", {
                    replace: true,
                });

            }


        } catch (error) {

            console.error(
                "Frontend login error:",
                error
            );


            setError(
                error.message ||
                "Invalid Employee ID / Email or Password."
            );


        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="login-container">


            {/* =================================================
                LEFT SIDE
            ================================================= */}

            <div className="login-left">


                <div className="logo">

                    <div className="logo-circle">

                        <span className="logo-a">
                            A
                        </span>

                        <span className="logo-b">
                            S
                        </span>

                    </div>


                    <div>

                        <h2>
                            AS GROUP
                        </h2>

                        <p>
                            Employee Management System
                        </p>

                    </div>

                </div>


                <h1>
                    Welcome Back
                </h1>


                <p className="subtitle">

                    Sign in with your company credentials
                    to access your Employee Management
                    System.

                </p>


                <div className="features">

                    <div>
                        ✓ Secure Authentication
                    </div>

                    <div>
                        ✓ Role Based Access
                    </div>

                    <div>
                        ✓ Employee & Admin Portal
                    </div>

                    <div>
                        ✓ HR Managed Accounts
                    </div>

                </div>

            </div>


            {/* =================================================
                RIGHT SIDE
            ================================================= */}

            <div className="login-right">


                <form
                    onSubmit={handleLogin}
                    className="login-card"
                >


                    <h2>
                        Sign In
                    </h2>


                    <p>
                        Login using your Employee ID
                        or Company Email.
                    </p>


                    {/* ===============================
                        ERROR
                    =============================== */}

                    {error && (

                        <div className="error-box">

                            {error}

                        </div>

                    )}


                    {/* ===============================
                        IDENTIFIER
                    =============================== */}

                    <div className="input-box">

                        <FaUser />

                        <input
                            type="text"
                            placeholder="Employee ID / Company Email"
                            value={identifier}
                            onChange={(e) =>
                                setIdentifier(
                                    e.target.value
                                )
                            }
                            disabled={loading}
                            autoComplete="username"
                        />

                    </div>


                    {/* ===============================
                        PASSWORD
                    =============================== */}

                    <div className="input-box">

                        <FaLock />

                        <input
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            placeholder="Password"
                            value={password}
                            onChange={(e) =>
                                setPassword(
                                    e.target.value
                                )
                            }
                            disabled={loading}
                            autoComplete="current-password"
                        />


                        <span
                            className="eye"
                            onClick={() =>
                                !loading &&
                                setShowPassword(
                                    !showPassword
                                )
                            }
                        >

                            {showPassword
                                ? <FaEyeSlash />
                                : <FaEye />
                            }

                        </span>

                    </div>


                    {/* ===============================
                        OPTIONS
                    =============================== */}

                    <div className="login-options">

                        <label>

                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) =>
                                    setRememberMe(
                                        e.target.checked
                                    )
                                }
                                disabled={loading}
                            />

                            Remember Me

                        </label>


                        <button
                            type="button"
                            className="forgot-btn"
                            onClick={() =>
                                setShowMessage(true)
                            }
                            disabled={loading}
                        >

                            Forgot Password?

                        </button>

                    </div>


                    {/* ===============================
                        LOGIN BUTTON
                    =============================== */}

                    <button
                        type="submit"
                        className="login-btn2"
                        disabled={loading}
                    >

                        {loading
                            ? "Signing In..."
                            : "Sign In"
                        }

                    </button>


                    <div className="footer-text">

                        Company credentials are issued by

                        <strong>
                            {" "}HR/Admin
                        </strong>.

                    </div>


                </form>

            </div>


            {/* =================================================
                FORGOT PASSWORD MODAL
            ================================================= */}

            {showMessage && (

                <div className="modal">

                    <div className="modal-content">

                        <h3>
                            Password Reset
                        </h3>


                        <p>
                            Passwords are managed by your
                            organization's HR/Admin.
                        </p>


                        <p>
                            Please contact HR/Admin if you
                            cannot access your account.
                        </p>


                        <button
                            type="button"
                            onClick={() =>
                                setShowMessage(false)
                            }
                        >

                            Close

                        </button>

                    </div>

                </div>

            )}

        </div>

    );

};


export default Login;