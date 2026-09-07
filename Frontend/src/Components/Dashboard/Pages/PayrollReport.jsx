import { useEffect, useMemo, useState } from "react";

import "./PayrollReport.css";

import {
    FaMoneyBillWave,
    FaUser,
    FaCalendarAlt,
    FaCheckCircle,
    FaClock,
    FaSearch,
} from "react-icons/fa";

import { usePayroll } from "../../../context/PayrollContext";
import { useEmployees } from "../../../context/EmployeeContext";

const PayrollReport = () => {

    const {
        payrollRecords = [],
        loading,
        error,
        fetchAllPayroll,
    } = usePayroll();

    const {
        employees = [],
        loading: employeesLoading,
    } = useEmployees();

    const [selectedEmployeeId, setSelectedEmployeeId] =
        useState("");

    const [selectedMonth, setSelectedMonth] =
        useState("");

    const [selectedStatus, setSelectedStatus] =
        useState("All");


    /*
    ==========================================
            LOAD PAYROLL
    ==========================================
    */

    useEffect(() => {

        fetchAllPayroll();

    }, [fetchAllPayroll]);


    /*
    ==========================================
            EMPLOYEE LIST
    ==========================================
    */

    const employeeList = useMemo(() => {

        return employees.filter(
            (employee) =>
                employee.role === "employee"
        );

    }, [employees]);


    /*
    ==========================================
            FILTER PAYROLL
    ==========================================
    */

    const filteredPayroll = useMemo(() => {

        return payrollRecords
            .filter((payroll) => {

                const employeeMatch =
                    !selectedEmployeeId ||
                    payroll.employeeId ===
                        selectedEmployeeId;

                const monthMatch =
                    !selectedMonth ||
                    payroll.month ===
                        selectedMonth;

                const statusMatch =
                    selectedStatus === "All" ||
                    payroll.status ===
                        selectedStatus;

                return (
                    employeeMatch &&
                    monthMatch &&
                    statusMatch
                );
            })
            .sort((a, b) => {

                const monthA =
                    a.month || "";

                const monthB =
                    b.month || "";

                return monthB.localeCompare(
                    monthA
                );
            });

    }, [
        payrollRecords,
        selectedEmployeeId,
        selectedMonth,
        selectedStatus,
    ]);


    /*
    ==========================================
                SUMMARY
    ==========================================
    */

    const totalPayrollRecords =
        filteredPayroll.length;

    const totalBasicSalary =
        filteredPayroll.reduce(
            (total, payroll) =>
                total +
                Number(payroll.basic || 0),
            0
        );

    const totalAllowances =
        filteredPayroll.reduce(
            (total, payroll) =>
                total +
                Number(
                    payroll.totalAllowances || 0
                ),
            0
        );

    const totalDeductions =
        filteredPayroll.reduce(
            (total, payroll) =>
                total +
                Number(
                    payroll.totalDeductions || 0
                ),
            0
        );

    const totalNetSalary =
        filteredPayroll.reduce(
            (total, payroll) =>
                total +
                Number(
                    payroll.netSalary || 0
                ),
            0
        );


    /*
    ==========================================
            FORMAT CURRENCY
    ==========================================
    */

    const formatCurrency = (value) => {

        return `₹ ${Number(
            value || 0
        ).toLocaleString("en-IN")}`;

    };


    /*
    ==========================================
            FORMAT MONTH
    ==========================================
    */

    const formatMonth = (month) => {

        if (!month) {
            return "--";
        }

        const [year, monthNumber] =
            month.split("-");

        const date = new Date(
            Number(year),
            Number(monthNumber) - 1,
            1
        );

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return month;
        }

        return date.toLocaleDateString(
            "en-IN",
            {
                month: "short",
                year: "numeric",
            }
        );
    };


    /*
    ==========================================
            FORMAT DATE
    ==========================================
    */

    const formatDate = (date) => {

        if (!date) {
            return "--";
        }

        const parsedDate =
            new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return "--";
        }

        return parsedDate.toLocaleDateString(
            "en-IN"
        );
    };


    /*
    ==========================================
            STATUS CLASS
    ==========================================
    */

    const getStatusClass = (
        status
    ) => {

        if (status === "Paid") {
            return "paid";
        }

        return "pending";
    };


    /*
    ==========================================
                RESET
    ==========================================
    */

    const resetFilters = () => {

        setSelectedEmployeeId("");
        setSelectedMonth("");
        setSelectedStatus("All");

    };


    /*
    ==========================================
                LOADING
    ==========================================
    */

    if (
        loading ||
        employeesLoading
    ) {

        return (
            <div className="payroll-report">

                <div className="payroll-empty-state">

                    <FaMoneyBillWave />

                    <h3>
                        Loading Payroll Report
                    </h3>

                    <p>
                        Loading payroll
                        records...
                    </p>

                </div>

            </div>
        );
    }


    /*
    ==========================================
                ERROR
    ==========================================
    */

    if (error) {

        return (
            <div className="payroll-report">

                <div className="payroll-empty-state">

                    <FaMoneyBillWave />

                    <h3>
                        Unable to Load Payroll
                    </h3>

                    <p>
                        {error}
                    </p>

                    <button
                        type="button"
                        className="payroll-retry-btn"
                        onClick={
                            fetchAllPayroll
                        }
                    >
                        Try Again
                    </button>

                </div>

            </div>
        );
    }


    return (

        <div className="payroll-report">

            {/* =================================
                    HEADER
            ================================= */}

            <div className="payroll-report-header">

                <div>

                    <h3>
                        Payroll Report
                    </h3>

                    <p>
                        View salary, allowances,
                        deductions and payroll
                        history.
                    </p>

                </div>

                <div className="payroll-report-icon">

                    <FaMoneyBillWave />

                </div>

            </div>


            {/* =================================
                    FILTERS
            ================================= */}

            <div className="payroll-filters">

                {/* EMPLOYEE */}

                <div className="payroll-filter-group">

                    <label>
                        Employee
                    </label>

                    <div className="payroll-select-wrapper">

                        <FaUser />

                        <select
                            value={
                                selectedEmployeeId
                            }
                            onChange={(e) =>
                                setSelectedEmployeeId(
                                    e.target.value
                                )
                            }
                        >

                            <option value="">
                                All Employees
                            </option>

                            {employeeList.map(
                                (employee) => (

                                    <option
                                        key={
                                            employee._id ||
                                            employee.id ||
                                            employee.employeeId
                                        }
                                        value={
                                            employee.employeeId
                                        }
                                    >
                                        {employee.name}
                                        {" - "}
                                        {
                                            employee.employeeId
                                        }
                                    </option>

                                )
                            )}

                        </select>

                    </div>

                </div>


                {/* MONTH */}

                <div className="payroll-filter-group">

                    <label>
                        Month
                    </label>

                    <div className="payroll-input-wrapper">

                        <FaCalendarAlt />

                        <input
                            type="month"
                            value={
                                selectedMonth
                            }
                            onChange={(e) =>
                                setSelectedMonth(
                                    e.target.value
                                )
                            }
                        />

                    </div>

                </div>


                {/* STATUS */}

                <div className="payroll-filter-group">

                    <label>
                        Payment Status
                    </label>

                    <select
                        value={
                            selectedStatus
                        }
                        onChange={(e) =>
                            setSelectedStatus(
                                e.target.value
                            )
                        }
                    >

                        <option value="All">
                            All Status
                        </option>

                        <option value="Paid">
                            Paid
                        </option>

                        <option value="Pending">
                            Pending
                        </option>

                    </select>

                </div>


                {/* RESET */}

                <div className="payroll-filter-action">

                    <button
                        type="button"
                        onClick={
                            resetFilters
                        }
                    >
                        <FaSearch />
                        Reset
                    </button>

                </div>

            </div>


            {/* =================================
                    SUMMARY
            ================================= */}

            <div className="payroll-summary">

                <SummaryCard
                    icon={<FaMoneyBillWave />}
                    title="Payroll Records"
                    value={
                        totalPayrollRecords
                    }
                />

                <SummaryCard
                    icon={<FaUser />}
                    title="Basic Salary"
                    value={formatCurrency(
                        totalBasicSalary
                    )}
                />

                <SummaryCard
                    icon={<FaMoneyBillWave />}
                    title="Allowances"
                    value={formatCurrency(
                        totalAllowances
                    )}
                    type="allowance"
                />

                <SummaryCard
                    icon={<FaMoneyBillWave />}
                    title="Deductions"
                    value={formatCurrency(
                        totalDeductions
                    )}
                    type="deduction"
                />

                <SummaryCard
                    icon={<FaCheckCircle />}
                    title="Net Payroll"
                    value={formatCurrency(
                        totalNetSalary
                    )}
                    type="net"
                />

            </div>


            {/* =================================
                    PAYROLL TABLE
            ================================= */}

            <div className="payroll-table-section">

                <div className="payroll-table-header">

                    <div>

                        <h3>
                            Payroll History
                        </h3>

                        <p>
                            {
                                filteredPayroll.length
                            }
                            {" "}
                            record
                            {filteredPayroll.length !==
                            1
                                ? "s"
                                : ""}
                        </p>

                    </div>

                </div>


                {filteredPayroll.length === 0 ? (

                    <div className="payroll-empty-table">

                        <FaMoneyBillWave />

                        <h3>
                            No Payroll Records
                        </h3>

                        <p>
                            No payroll records
                            match the selected
                            filters.
                        </p>

                    </div>

                ) : (

                    <div className="payroll-table-wrapper">

                        <table>

                            <thead>

                                <tr>

                                    <th>
                                        Employee
                                    </th>

                                    <th>
                                        Employee ID
                                    </th>

                                    <th>
                                        Month
                                    </th>

                                    <th>
                                        Basic
                                    </th>

                                    <th>
                                        Allowances
                                    </th>

                                    <th>
                                        Deductions
                                    </th>

                                    <th>
                                        Gross
                                    </th>

                                    <th>
                                        Net Salary
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Paid On
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {filteredPayroll.map(
                                    (payroll) => (

                                        <tr
                                            key={
                                                payroll._id ||
                                                payroll.id ||
                                                `${payroll.employeeId}-${payroll.month}`
                                            }
                                        >

                                            {/* EMPLOYEE */}

                                            <td>

                                                <div className="payroll-employee">

                                                    <div className="payroll-avatar">

                                                        {payroll.employeeName
                                                            ?.charAt(
                                                                0
                                                            )
                                                            .toUpperCase() ||
                                                            "E"}

                                                    </div>

                                                    <strong>
                                                        {
                                                            payroll.employeeName ||
                                                            "--"
                                                        }
                                                    </strong>

                                                </div>

                                            </td>


                                            {/* ID */}

                                            <td>
                                                {
                                                    payroll.employeeId ||
                                                    "--"
                                                }
                                            </td>


                                            {/* MONTH */}

                                            <td>
                                                {
                                                    formatMonth(
                                                        payroll.month
                                                    )
                                                }
                                            </td>


                                            {/* BASIC */}

                                            <td>
                                                {
                                                    formatCurrency(
                                                        payroll.basic
                                                    )
                                                }
                                            </td>


                                            {/* ALLOWANCES */}

                                            <td>
                                                {
                                                    formatCurrency(
                                                        payroll.totalAllowances
                                                    )
                                                }
                                            </td>


                                            {/* DEDUCTIONS */}

                                            <td>
                                                {
                                                    formatCurrency(
                                                        payroll.totalDeductions
                                                    )
                                                }
                                            </td>


                                            {/* GROSS */}

                                            <td>
                                                {
                                                    formatCurrency(
                                                        payroll.grossSalary
                                                    )
                                                }
                                            </td>


                                            {/* NET */}

                                            <td>

                                                <strong className="payroll-net-value">
                                                    {
                                                        formatCurrency(
                                                            payroll.netSalary
                                                        )
                                                    }
                                                </strong>

                                            </td>


                                            {/* STATUS */}

                                            <td>

                                                <span
                                                    className={`payroll-status ${getStatusClass(
                                                        payroll.status
                                                    )}`}
                                                >

                                                    {payroll.status ===
                                                    "Paid" ? (
                                                        <FaCheckCircle />
                                                    ) : (
                                                        <FaClock />
                                                    )}

                                                    {
                                                        payroll.status ||
                                                        "--"
                                                    }

                                                </span>

                                            </td>


                                            {/* PAID ON */}

                                            <td>
                                                {
                                                    formatDate(
                                                        payroll.paidOn
                                                    )
                                                }
                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>


            {/* =================================
                    FOOTER
            ================================= */}

            <div className="payroll-report-footer">

                <span>
                    Report generated on{" "}
                    {new Date().toLocaleDateString(
                        "en-IN"
                    )}
                </span>

                <span>
                    Showing{" "}
                    {
                        filteredPayroll.length
                    }
                    {" "}
                    of{" "}
                    {
                        payrollRecords.length
                    }
                    {" "}
                    records
                </span>

            </div>

        </div>
    );
};


/*
==========================================
            SUMMARY CARD
==========================================
*/

const SummaryCard = ({
    icon,
    title,
    value,
    type = "",
}) => {

    return (

        <div
            className={`payroll-summary-card ${type}`}
        >

            <div className="payroll-summary-icon">

                {icon}

            </div>

            <div>

                <span>
                    {title}
                </span>

                <strong>
                    {value}
                </strong>

            </div>

        </div>
    );
};


export default PayrollReport;