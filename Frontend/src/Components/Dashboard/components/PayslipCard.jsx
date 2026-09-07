import "./Card.css";

import { useMemo, useState } from "react";

import {
    FaFileInvoiceDollar,
    FaDownload,
    FaArrowRight,
} from "react-icons/fa";

import { useEmployees } from "../../../context/EmployeeContext";

import PayslipModal from "../Modals/PayslipModal";


const PayslipCard = ({ setActiveSection }) => {

    const { currentEmployee: employee } = useEmployees();


    const [showPayslip, setShowPayslip] =
        useState(false);


    /* ===============================
            LATEST PAYSLIP
    =============================== */

    const latestPayslip = useMemo(() => {

        if (!employee) return null;

        const payrollHistory =
            employee.payrollHistory || [];


        if (payrollHistory.length === 0) {

            return null;

        }


        /*
            Admin Payroll adds new records
            to the end of payrollHistory.

            Therefore the last record is
            the latest generated payroll.
        */

        return payrollHistory[
            payrollHistory.length - 1
        ];

    }, [employee]);


    /* ===============================
            VIEW PAYROLL
    =============================== */

    const handleViewPayroll = () => {

        if (setActiveSection) {

            setActiveSection("payroll");

        }

    };


    /* ===============================
            VIEW PAYSLIP
    =============================== */

    const handleViewPayslip = () => {

        if (!latestPayslip) return;

        setShowPayslip(true);

    };


    return (

        <div className="dashboard-card">


            {/* ===============================
                    HEADER
            =============================== */}

            <div className="card-header">

                <h3>
                    Latest Payslip
                </h3>


                <FaFileInvoiceDollar
                    className="card-header-icon"
                />

            </div>


            {latestPayslip ? (

                <>


                    {/* ===============================
                            PAYSLIP DETAILS
                    =============================== */}

                    <div className="payslip-details">


                        <div>

                            <span>
                                Month
                            </span>

                            <strong>
                                {latestPayslip.month}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Net Salary
                            </span>

                            <strong>
                                ₹
                                {Number(
                                    latestPayslip.netSalary || 0
                                ).toLocaleString("en-IN")}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Status
                            </span>

                            <strong
                                className="payslip-status"
                            >
                                {latestPayslip.status ||
                                    "Generated"}
                            </strong>

                        </div>


                    </div>


                    {/* ===============================
                            ACTIONS
                    =============================== */}

                    <div className="payslip-actions">


                        <button
                            type="button"
                            className="download-btn"
                            onClick={handleViewPayslip}
                        >

                            <FaDownload />

                            View Payslip

                        </button>


                        <button
                            type="button"
                            className="link-btn"
                            onClick={handleViewPayroll}
                        >

                            All Payroll

                            <FaArrowRight />

                        </button>


                    </div>


                </>

            ) : (


                /* ===============================
                        EMPTY STATE
                =============================== */

                <div className="empty-card">

                    <FaFileInvoiceDollar
                        size={42}
                    />

                    <h4>
                        No Payslip Available
                    </h4>

                    <p>
                        Your latest payslip will appear here
                        once payroll has been processed.
                    </p>

                </div>

            )}


            {/* ===============================
                    PAYSLIP MODAL
            =============================== */}

            <PayslipModal

                open={showPayslip}

                payroll={latestPayslip}

                onClose={() =>
                    setShowPayslip(false)
                }

            />


        </div>

    );

};


export default PayslipCard;