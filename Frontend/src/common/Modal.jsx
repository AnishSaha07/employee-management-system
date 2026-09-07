import "./Modal.css";
import React from "react";

import { FaTimes } from "react-icons/fa";

const Modal = ({
    open,
    title,
    children,
    onClose,
    size = "medium",
}) => {

    if (!open) return null;

    return (

        <div
            className="modal-overlay"
            onClick={onClose}
        >

            <div
             className={`modal ${size}`}
             onClick={(e) => e.stopPropagation()}
            >

                <div className="modal-header">

                    <h2>

                        {title}

                    </h2>

                    <button
                        className="close-btn"
                        onClick={onClose}
                    >

                        <FaTimes/>

                    </button>

                </div>

                <div className="modal-body">

                    {children}

                </div>

            </div>

        </div>

    );

};

export default Modal;