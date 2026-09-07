import {
    useEffect,
    useMemo,
    useState,
} from "react";

import "./EmployeePayroll.css";

import PayrollTable from "./PayrollTable";

import SalaryBreakdown from "./SalaryBreakdown";

import PayslipModal from "../Modals/PayslipModal";

import {
    FaWallet,
    FaMoneyBillWave,
    FaArrowUp,
    FaArrowDown,
} from "react-icons/fa";

import { getCurrentUser } from "../../../utils/auth";

import { usePayroll } from "../../../context/PayrollContext";


const EmployeePayroll = () => {

    const [selectedPayslip, setSelectedPayslip] =
        useState(null);

    const currentUser = getCurrentUser();


    const {
        payrollRecords,
        fetchMyPayroll,
        loading,
        error,
    } = usePayroll();


    /* ==========================================
                    LOAD MY PAYROLL
    ========================================== */

    useEffect(() => {

        fetchMyPayroll();

    }, [fetchMyPayroll]);


    /* ==========================================
                    MY PAYROLL
    ========================================== */

    const payrollData = useMemo(() => {

        if (!currentUser?.employeeId) {
            return [];
        }

        return payrollRecords.filter(
            (payroll) =>
                payroll.employeeId ===
                currentUser.employeeId
        );

    }, [
        payrollRecords,
        currentUser?.employeeId,
    ]);


    /* ==========================================
                    LATEST PAYROLL
    ========================================== */

    const latestPayroll =
        payrollData.length > 0
            ? payrollData[0]
            : null;


    /*
        fetchMyPayroll should normally return
        newest records first.

        We don't rely on employee.payrollHistory
        anymore.
    */


    /* ==========================================
                    LOADING
    ========================================== */

    if (
        loading &&
        payrollRecords.length === 0
    ) {

        return (

            <section className="employee-payroll">

                <div className="employee-page-header">

                    <div>

                        <h2>
                            Payroll
                        </h2>

                        <p>
                            View your salary history and payslips.
                        </p>

                    </div>

                </div>

                <div className="payroll-empty-state">

                    Loading payroll records...

                </div>

            </section>

        );

    }


    /* ==========================================
                    ERROR
    ========================================== */

    if (error && payrollRecords.length === 0) {

        return (

            <section className="employee-payroll">

                <div className="employee-page-header">

                    <div>

                        <h2>
                            Payroll
                        </h2>

                        <p>
                            View your salary history and payslips.
                        </p>

                    </div>

                </div>

                <div className="error-box">

                    {error}

                </div>

            </section>

        );

    }


    /* ==========================================
                NO PAYROLL YET
    ========================================== */

    const basicSalary =
        Number(
            latestPayroll?.basic
        ) || 0;


    /* ==========================================
                    ALLOWANCES
    ========================================== */

    const totalAllowances =
        latestPayroll?.allowances

            ? (
                Number(
                    latestPayroll.allowances.hra
                ) || 0
            ) + (

                Number(
                    latestPayroll.allowances.medical
                ) || 0
            ) + (

                Number(
                    latestPayroll.allowances.travel
                ) || 0
            ) + (

                Number(
                    latestPayroll.allowances.special
                ) || 0
            ) + (

                Number(
                    latestPayroll.allowances.bonus
                ) || 0
            )

            : Number(
                latestPayroll?.allowance
            ) || 0;


    /* ==========================================
                    DEDUCTIONS
    ========================================== */

    const totalDeductions =
        latestPayroll?.deductions

            ? (
                Number(
                    latestPayroll.deductions.pf
                ) || 0
            ) + (

                Number(
                    latestPayroll.deductions.tax
                ) || 0
            ) + (

                Number(
                    latestPayroll.deductions.other
                ) || 0
            )

            : Number(
                latestPayroll?.deduction
            ) || 0;


    /* ==========================================
                    NET SALARY
    ========================================== */

    const netSalary =
        Number(
            latestPayroll?.netSalary
        ) ||
        (
            basicSalary +
            totalAllowances -
            totalDeductions
        );


    /* ==========================================
                NORMALIZED PAYROLL
    ========================================== */

    const normalizedPayroll = {

        ...(latestPayroll || {}),

        basic:
            basicSalary,

        allowance:
            totalAllowances,

        deduction:
            totalDeductions,

        netSalary,

        allowances:
            latestPayroll?.allowances || {

                hra: 0,
                medical: 0,
                travel: 0,
                special: 0,
                bonus: 0,

            },

        deductions:
            latestPayroll?.deductions || {

                pf: 0,
                tax: 0,
                other: 0,

            },

    };


    /* ==========================================
                    UI
    ========================================== */

    return (

        <section className="employee-payroll">


            {/* HEADER */}

            <div className="employee-page-header">

                <div>

                    <h2>
                        Payroll
                    </h2>

                    <p>
                        View your salary history and payslips.
                    </p>

                </div>

            </div>


            {/* ERROR */}

            {error && (

                <div className="error-box">

                    {error}

                </div>

            )}


            {/* SUMMARY */}

            <div className="payroll-summary-grid">


                {/* NET */}

                <div className="payroll-summary-card">

                    <FaWallet />

                    <span>
                        Net Salary
                    </span>

                    <h2>

                        ₹{" "}

                        {netSalary.toLocaleString(
                            "en-IN"
                        )}

                    </h2>

                </div>


                {/* BASIC */}

                <div className="payroll-summary-card">

                    <FaMoneyBillWave />

                    <span>
                        Basic Salary
                    </span>

                    <h2>

                        ₹{" "}

                        {basicSalary.toLocaleString(
                            "en-IN"
                        )}

                    </h2>

                </div>


                {/* ALLOWANCES */}

                <div className="payroll-summary-card">

                    <FaArrowUp />

                    <span>
                        Allowances
                    </span>

                    <h2>

                        ₹{" "}

                        {totalAllowances.toLocaleString(
                            "en-IN"
                        )}

                    </h2>

                </div>


                {/* DEDUCTIONS */}

                <div className="payroll-summary-card">

                    <FaArrowDown />

                    <span>
                        Deductions
                    </span>

                    <h2>

                        ₹{" "}

                        {totalDeductions.toLocaleString(
                            "en-IN"
                        )}

                    </h2>

                </div>

            </div>


            {/* PAYROLL CONTENT */}

            {payrollData.length === 0 ? (

                <div className="payroll-empty-state">

                    <h3>
                        No Payroll Records
                    </h3>

                    <p>
                        Your payroll records will appear here once the administrator generates your salary.
                    </p>

                </div>

            ) : (

                <div className="payroll-grid">

                    <SalaryBreakdown
                        payroll={
                            normalizedPayroll
                        }
                    />

                    <PayrollTable
                        payrollData={
                            payrollData
                        }
                        onView={
                            setSelectedPayslip
                        }
                    />

                </div>

            )}


            {/* PAYSLIP */}

            <PayslipModal

                open={
                    !!selectedPayslip
                }

                payroll={
                    selectedPayslip
                }

                onClose={() =>
                    setSelectedPayslip(null)
                }

            />

        </section>

    );

};


export default EmployeePayroll;