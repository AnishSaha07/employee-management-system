import { useState } from "react";

import "./ApplyLeaveModal.css";

import Modal from "../../../common/Modal";

import { useLeave } from "../../../context/LeaveContext";

import { useToast } from "../../../context/ToastContext";


const INITIAL_STATE = {

    leaveType: "Casual Leave",

    fromDate: "",

    toDate: "",

    reason: "",

};


const ApplyLeaveModal = ({
    open,
    onClose,
}) => {

    const {
        applyLeave,
    } = useLeave();

    const {
        showToast,
    } = useToast();


    const [formData, setFormData] =
        useState(INITIAL_STATE);

    const [submitting, setSubmitting] =
        useState(false);


    /* ==========================================
                    HANDLE CHANGE
    ========================================== */

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


    /* ==========================================
                    SUBMIT
    ========================================== */

    const handleSubmit = async (e) => {

        e.preventDefault();


        /* --------------------------------------
                    BASIC VALIDATION
        -------------------------------------- */

        if (
            !formData.fromDate ||
            !formData.toDate
        ) {

            showToast(
                "error",
                "Missing Dates",
                "Please select both start and end dates."
            );

            return;
        }


        if (
            formData.fromDate >
            formData.toDate
        ) {

            showToast(
                "error",
                "Invalid Dates",
                "From date cannot be greater than To date."
            );

            return;
        }


        if (
            !formData.reason.trim()
        ) {

            showToast(
                "error",
                "Missing Reason",
                "Please enter a reason for your leave."
            );

            return;
        }


        try {

            setSubmitting(true);


            /* ----------------------------------
                    SEND TO BACKEND
            ---------------------------------- */

            const result =
                await applyLeave({

                    leaveType:
                        formData.leaveType,

                    fromDate:
                        formData.fromDate,

                    toDate:
                        formData.toDate,

                    reason:
                        formData.reason.trim(),

                });


            /* ----------------------------------
                    SUCCESS
            ---------------------------------- */

            if (result?.success) {

                showToast(
                    "success",
                    "Leave Applied",
                    "Leave request submitted successfully."
                );

                setFormData(
                    INITIAL_STATE
                );

                onClose();

            } else {

                showToast(
                    "error",
                    "Leave Request Failed",
                    result?.message ||
                        "Failed to submit leave request."
                );

            }

        } catch (error) {

            console.error(
                "Apply leave error:",
                error
            );

            showToast(
                "error",
                "Leave Request Failed",
                "Unable to submit leave request."
            );

        } finally {

            setSubmitting(false);

        }

    };


    return (

        <Modal
            open={open}
            title="Apply Leave"
            onClose={
                submitting
                    ? undefined
                    : onClose
            }
        >

            <form
                className="leave-form"
                onSubmit={handleSubmit}
            >


                {/* =================================
                            LEAVE TYPE
                ================================= */}

                <div className="leave-group">

                    <label>
                        Leave Type
                    </label>

                    <select
                        name="leaveType"
                        value={
                            formData.leaveType
                        }
                        onChange={
                            handleChange
                        }
                        disabled={
                            submitting
                        }
                    >

                        <option value="Casual Leave">
                            Casual Leave
                        </option>

                        <option value="Sick Leave">
                            Sick Leave
                        </option>

                        <option value="Earned Leave">
                            Earned Leave
                        </option>

                        <option value="Maternity Leave">
                            Maternity Leave
                        </option>

                        <option value="Paternity Leave">
                            Paternity Leave
                        </option>

                    </select>

                </div>


                {/* =================================
                            DATES
                ================================= */}

                <div className="leave-row">


                    <div className="leave-group">

                        <label>
                            From Date
                        </label>

                        <input
                            type="date"
                            name="fromDate"
                            value={
                                formData.fromDate
                            }
                            onChange={
                                handleChange
                            }
                            required
                            disabled={
                                submitting
                            }
                        />

                    </div>


                    <div className="leave-group">

                        <label>
                            To Date
                        </label>

                        <input
                            type="date"
                            name="toDate"
                            value={
                                formData.toDate
                            }
                            onChange={
                                handleChange
                            }
                            required
                            disabled={
                                submitting
                            }
                        />

                    </div>

                </div>


                {/* =================================
                            REASON
                ================================= */}

                <div className="leave-group">

                    <label>
                        Reason
                    </label>

                    <textarea
                        rows="4"
                        name="reason"
                        placeholder="Enter reason..."
                        value={
                            formData.reason
                        }
                        onChange={
                            handleChange
                        }
                        required
                        disabled={
                            submitting
                        }
                    />

                </div>


                {/* =================================
                            BUTTONS
                ================================= */}

                <div className="leave-buttons">


                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={
                            onClose
                        }
                        disabled={
                            submitting
                        }
                    >

                        Cancel

                    </button>


                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={
                            submitting
                        }
                    >

                        {submitting
                            ? "Submitting..."
                            : "Submit Request"
                        }

                    </button>

                </div>

            </form>

        </Modal>

    );

};


export default ApplyLeaveModal;