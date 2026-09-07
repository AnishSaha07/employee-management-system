import "./PayslipModal.css";

import Modal from "../../../common/Modal";

import {
    FaBuilding,
    FaCalendarAlt,
    FaUserTie,
    FaMoneyCheckAlt,
    FaDownload,
} from "react-icons/fa";

import { getCurrentUser } from "../../../utils/auth";


const PayslipModal = ({
    open,
    payroll,
    onClose,
}) => {

    const user = getCurrentUser();

    if (!payroll) return null;


    /* =================================
            ALLOWANCES
    ================================= */

    const allowances =
        payroll.allowances || {};

    const hra =
        Number(allowances.hra) || 0;

    const medical =
        Number(allowances.medical) || 0;

    const travel =
        Number(allowances.travel) || 0;

    const special =
        Number(allowances.special) || 0;

    const bonus =
        Number(allowances.bonus) || 0;


    /* =================================
            DEDUCTIONS
    ================================= */

    const deductions =
        payroll.deductions || {};

    const pf =
        Number(deductions.pf) || 0;

    const tax =
        Number(deductions.tax) || 0;

    const other =
        Number(deductions.other) || 0;


    /* =================================
            TOTALS
    ================================= */

    const totalAllowances =
        hra +
        medical +
        travel +
        special +
        bonus;


    const totalDeductions =
        pf +
        tax +
        other;


    const basicSalary =
        Number(payroll.basic) || 0;


    const netSalary =
        Number(payroll.netSalary) ||
        (
            basicSalary +
            totalAllowances -
            totalDeductions
        );


    return (

        <Modal
            open={open}
            onClose={onClose}
            title="Payslip"
            size="large"
        >

            <div className="payslip">


                {/* =================================
                        HEADER
                ================================= */}

                <div className="payslip-header">

                    <div>

                        <h2>
                            AS GROUP
                        </h2>

                        <p>
                            Employee Management System
                        </p>

                    </div>

                    <FaBuilding />

                </div>


                {/* =================================
                        EMPLOYEE DETAILS
                ================================= */}

                <div className="payslip-section">

                    <div className="info-row">

                        <span>

                            <FaUserTie />

                            Employee

                        </span>

                        <strong>
                            {user?.name || "--"}
                        </strong>

                    </div>


                    <div className="info-row">

                        <span>
                            Designation
                        </span>

                        <strong>
                            {user?.designation || "--"}
                        </strong>

                    </div>


                    <div className="info-row">

                        <span>
                            Department
                        </span>

                        <strong>
                            {user?.department || "--"}
                        </strong>

                    </div>


                    <div className="info-row">

                        <span>
                            Employee ID
                        </span>

                        <strong>
                            {user?.employeeId || "--"}
                        </strong>

                    </div>


                    <div className="info-row">

                        <span>

                            <FaCalendarAlt />

                            Salary Month

                        </span>

                        <strong>
                            {payroll.month || "--"}
                        </strong>

                    </div>


                    <div className="info-row">

                        <span>
                            Payment Date
                        </span>

                        <strong>
                            {payroll.paidOn || "--"}
                        </strong>

                    </div>

                </div>


                {/* =================================
                        EARNINGS
                ================================= */}

                <div className="salary-box">

                    <h3>
                        Earnings
                    </h3>


                    <div className="salary-row">

                        <span>
                            Basic Salary
                        </span>

                        <strong>
                            ₹ {basicSalary.toLocaleString("en-IN")}
                        </strong>

                    </div>


                    <div className="salary-row">

                        <span>
                            HRA
                        </span>

                        <strong>
                            ₹ {hra.toLocaleString("en-IN")}
                        </strong>

                    </div>


                    <div className="salary-row">

                        <span>
                            Medical
                        </span>

                        <strong>
                            ₹ {medical.toLocaleString("en-IN")}
                        </strong>

                    </div>


                    <div className="salary-row">

                        <span>
                            Travel
                        </span>

                        <strong>
                            ₹ {travel.toLocaleString("en-IN")}
                        </strong>

                    </div>


                    <div className="salary-row">

                        <span>
                            Special Allowance
                        </span>

                        <strong>
                            ₹ {special.toLocaleString("en-IN")}
                        </strong>

                    </div>


                    <div className="salary-row">

                        <span>
                            Bonus
                        </span>

                        <strong>
                            ₹ {bonus.toLocaleString("en-IN")}
                        </strong>

                    </div>


                    <div className="salary-row total-row">

                        <span>
                            Total Earnings
                        </span>

                        <strong>
                            ₹ {
                                (
                                    basicSalary +
                                    totalAllowances
                                ).toLocaleString("en-IN")
                            }
                        </strong>

                    </div>

                </div>


                {/* =================================
                        DEDUCTIONS
                ================================= */}

                <div className="salary-box">

                    <h3>
                        Deductions
                    </h3>


                    <div className="salary-row">

                        <span>
                            Provident Fund
                        </span>

                        <strong>
                            ₹ {pf.toLocaleString("en-IN")}
                        </strong>

                    </div>


                    <div className="salary-row">

                        <span>
                            Tax
                        </span>

                        <strong>
                            ₹ {tax.toLocaleString("en-IN")}
                        </strong>

                    </div>


                    <div className="salary-row">

                        <span>
                            Other Deduction
                        </span>

                        <strong>
                            ₹ {other.toLocaleString("en-IN")}
                        </strong>

                    </div>


                    <div className="salary-row total-row">

                        <span>
                            Total Deductions
                        </span>

                        <strong>
                            ₹ {totalDeductions.toLocaleString("en-IN")}
                        </strong>

                    </div>

                </div>


                {/* =================================
                        NET SALARY
                ================================= */}

                <div className="net-salary">

                    <FaMoneyCheckAlt />

                    <div>

                        <span>
                            Net Salary
                        </span>

                        <h2>

                            ₹ {netSalary.toLocaleString("en-IN")}

                        </h2>

                    </div>

                </div>


                {/* =================================
                        DOWNLOAD
                ================================= */}

                <button
                    className="download-payslip-btn"
                    onClick={() => window.print()}
                >

                    <FaDownload />

                    Download / Print

                </button>


            </div>

        </Modal>

    );

};

export default PayslipModal;