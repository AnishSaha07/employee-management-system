import "./Toast.css";
import React from "react";

import {
    FaCheckCircle,
    FaTimesCircle,
    FaInfoCircle,
} from "react-icons/fa";

const icons = {

    success: <FaCheckCircle />,

    error: <FaTimesCircle />,

    info: <FaInfoCircle />,

};

const Toast = ({ toast }) => {

    if (!toast.show) return null;

    return (

        <div className={`toast ${toast.type}`}>

            <div className="toast-icon">

                {icons[toast.type]}

            </div>

            <div className="toast-content">

                <h4>{toast.title}</h4>

                <p>{toast.message}</p>

            </div>

        </div>

    );

};

export default Toast;