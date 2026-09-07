import {
    useEffect,
    useMemo,
    useState,
} from "react";

import "./AdminPayroll.css";

import { useEmployees } from "../../../context/EmployeeContext";
import { usePayroll } from "../../../context/PayrollContext";
import { useToast } from "../../../context/ToastContext";

import {
    FaMoneyBillWave,
    FaUsers,
    FaCalculator,
    FaCheckCircle,
} from "react-icons/fa";


const INITIAL_FORM = {
    employeeId: "",
    month: "",
    hra: 0,
    medical: 0,
    travel: 0,
    special: 0,
    bonus: 0,
    pf: 0,
    tax: 0,
    other: 0,
};


const AdminPayroll = ({ onClose }) => {

    const { employees } = useEmployees();

    const {
        payrollRecords,
        fetchAllPayroll,
        generatePayroll,
        loading,
        error,
    } = usePayroll();

    const { showToast } = useToast();


    const [formData, setFormData] =
        useState(INITIAL_FORM);

    const [showPayrollForm, setShowPayrollForm] =
        useState(false);

    const [submitting, setSubmitting] =
        useState(false);


    /* ==========================================
                    EMPLOYEE LIST
    ========================================== */

    const employeeList = useMemo(() => {

        return employees.filter(
            (employee) =>
                employee.role === "employee"
        );

    }, [employees]);


    /* ==========================================
                    LOAD PAYROLL
                    ADMIN ONLY
    ========================================== */

    useEffect(() => {

        fetchAllPayroll();

    }, [fetchAllPayroll]);


    /* ==========================================
                    SELECTED EMPLOYEE
    ========================================== */

    const selectedEmployee = useMemo(() => {

        return employeeList.find(
            (employee) =>
                employee.employeeId ===
                formData.employeeId
        );

    }, [
        employeeList,
        formData.employeeId,
    ]);


    /* ==========================================
                    BASIC SALARY
    ========================================== */

    const basicSalary =
        Number(
            selectedEmployee?.basicSalary
        ) ||
        Number(
            selectedEmployee?.salary
        ) ||
        0;


    /* ==========================================
                    ALLOWANCES
    ========================================== */

    const allowances = {

        hra:
            Number(formData.hra) || 0,

        medical:
            Number(formData.medical) || 0,

        travel:
            Number(formData.travel) || 0,

        special:
            Number(formData.special) || 0,

        bonus:
            Number(formData.bonus) || 0,

    };


    const totalAllowances =
        allowances.hra +
        allowances.medical +
        allowances.travel +
        allowances.special +
        allowances.bonus;


    /* ==========================================
                    DEDUCTIONS
    ========================================== */

    const deductions = {

        pf:
            Number(formData.pf) || 0,

        tax:
            Number(formData.tax) || 0,

        other:
            Number(formData.other) || 0,

    };


    const totalDeductions =
        deductions.pf +
        deductions.tax +
        deductions.other;


    /* ==========================================
                    SALARY CALCULATION
    ========================================== */

    const grossSalary =
        basicSalary +
        totalAllowances;


    const netSalary =
        grossSalary -
        totalDeductions;


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
                GENERATE PAYROLL
    ========================================== */

    const handleGeneratePayroll = async (e) => {

        e.preventDefault();


        if (!selectedEmployee) {

            showToast(
                "error",
                "Employee Required",
                "Please select an employee."
            );

            return;
        }


        if (!formData.month) {

            showToast(
                "error",
                "Month Required",
                "Please select the payroll month."
            );

            return;
        }


        if (netSalary < 0) {

            showToast(
                "error",
                "Invalid Salary",
                "Net salary cannot be negative."
            );

            return;
        }


        try {

            setSubmitting(true);


            /*
                IMPORTANT:

                Payroll is now sent to
                the backend.

                Nothing is saved through
                EmployeeContext anymore.
            */

            const result =
                await generatePayroll({

                    employeeId:
                        formData.employeeId,

                    month:
                        formData.month,

                    hra:
                        allowances.hra,

                    medical:
                        allowances.medical,

                    travel:
                        allowances.travel,

                    special:
                        allowances.special,

                    bonus:
                        allowances.bonus,

                    pf:
                        deductions.pf,

                    tax:
                        deductions.tax,

                    other:
                        deductions.other,

                });


            if (result?.success) {

                showToast(
                    "success",
                    "Payroll Generated",
                    `Payroll generated successfully for ${selectedEmployee.name}.`
                );


                setFormData(
                    INITIAL_FORM
                );

                setShowPayrollForm(false);


                /*
                    Refresh from MongoDB.

                    This makes sure the UI reflects
                    the actual database state.
                */

                await fetchAllPayroll();

            } else {

                showToast(
                    "error",
                    "Payroll Failed",
                    result?.message ||
                        "Failed to generate payroll."
                );

            }

        } catch (error) {

            console.error(
                "Generate payroll error:",
                error
            );

            showToast(
                "error",
                "Payroll Failed",
                "Failed to generate payroll."
            );

        } finally {

            setSubmitting(false);

        }

    };


    /* ==========================================
                    LATEST PAYROLL
    ========================================== */

    const latestPayrollByEmployee =
        useMemo(() => {

            const map = {};

            payrollRecords.forEach(
                (payroll) => {

                    const employeeId =
                        payroll.employeeId ||
                        payroll.employee?.employeeId;

                    if (!employeeId) {
                        return;
                    }

                    /*
                        Backend returns newest first
                        in most implementations.

                        We keep the latest record
                        for each employee.
                    */

                    if (!map[employeeId]) {

                        map[employeeId] =
                            payroll;

                    }

                }
            );

            return map;

        }, [payrollRecords]);


    /* ==========================================
                    SUMMARY
    ========================================== */

    const totalPayroll =
        payrollRecords.reduce(
            (total, payroll) => {

                return (
                    total +
                    (
                        Number(
                            payroll.netSalary
                        ) || 0
                    )
                );

            },
            0
        );


    const generatedEmployees =
        employeeList.filter(
            (employee) =>
                latestPayrollByEmployee[
                    employee.employeeId
                ]
        ).length;


    /* ==========================================
                    LOADING
    ========================================== */

    if (
        loading &&
        payrollRecords.length === 0
    ) {

        return (

            <section className="admin-payroll">

                <div className="admin-page-header">

                    <div>

                        <h2>
                            Payroll
                        </h2>

                        <p>
                            Manage employee salaries and generate payroll.
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
                    UI
    ========================================== */

    return (

        <section className="admin-payroll">


            {/* HEADER */}

            <div className="admin-page-header">

                <div>

                    <h2>
                        Payroll
                    </h2>

                    <p>
                        Manage employee salaries and generate payroll.
                    </p>

                </div>


                <div className="payroll-header-actions">

                    {onClose && (

                        <button
                            type="button"
                            className="payroll-close-btn"
                            onClick={onClose}
                            disabled={submitting}
                        >

                            <span className="close-icon">
                                ×
                            </span>

                            <span>
                                Close
                            </span>

                        </button>

                    )}


                    <button
                        type="button"
                        className="generate-payroll-btn"
                        onClick={() =>
                            setShowPayrollForm(true)
                        }
                        disabled={loading || submitting}
                    >

                        <FaCalculator />

                        Generate Payroll

                    </button>

                </div>

            </div>


            {/* ERROR */}

            {error && (

                <div className="error-box">

                    {error}

                </div>

            )}


            {/* SUMMARY */}

            <div className="payroll-admin-stats">


                <div className="admin-payroll-stat">

                    <div className="payroll-stat-icon blue">

                        <FaUsers />

                    </div>

                    <div>

                        <span>
                            Employees
                        </span>

                        <h3>
                            {employeeList.length}
                        </h3>

                    </div>

                </div>


                <div className="admin-payroll-stat">

                    <div className="payroll-stat-icon green">

                        <FaMoneyBillWave />

                    </div>

                    <div>

                        <span>
                            Total Payroll
                        </span>

                        <h3>
                            ₹{" "}
                            {totalPayroll.toLocaleString(
                                "en-IN"
                            )}
                        </h3>

                    </div>

                </div>


                <div className="admin-payroll-stat">

                    <div className="payroll-stat-icon purple">

                        <FaCheckCircle />

                    </div>

                    <div>

                        <span>
                            Generated
                        </span>

                        <h3>
                            {generatedEmployees}
                        </h3>

                    </div>

                </div>

            </div>


            {/* PAYROLL TABLE */}

            <div className="admin-payroll-table-card">

                <div className="table-header">

                    <div>

                        <h3>
                            Employee Payroll
                        </h3>

                        <p>
                            Salary records generated for employees.
                        </p>

                    </div>

                </div>


                <div className="payroll-table-wrapper">

                    <table className="admin-payroll-table">

                        <thead>

                            <tr>

                                <th>
                                    Employee
                                </th>

                                <th>
                                    Employee ID
                                </th>

                                <th>
                                    Basic Salary
                                </th>

                                <th>
                                    Latest Net Salary
                                </th>

                                <th>
                                    Status
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {employeeList.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="5"
                                        className="empty-payroll"
                                    >

                                        No employees found.

                                    </td>

                                </tr>

                            ) : (

                                employeeList.map(
                                    (employee) => {

                                        const latest =
                                            latestPayrollByEmployee[
                                                employee.employeeId
                                            ];


                                        return (

                                            <tr
                                                key={
                                                    employee._id ||
                                                    employee.id ||
                                                    employee.employeeId
                                                }
                                            >

                                                <td>

                                                    <strong>
                                                        {employee.name}
                                                    </strong>

                                                    <small>
                                                        {employee.designation}
                                                    </small>

                                                </td>


                                                <td>
                                                    {employee.employeeId}
                                                </td>


                                                <td>

                                                    ₹{" "}

                                                    {Number(
                                                        employee.basicSalary ||
                                                        employee.salary ||
                                                        0
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )}

                                                </td>


                                                <td>

                                                    ₹{" "}

                                                    {Number(
                                                        latest?.netSalary ||
                                                        0
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )}

                                                </td>


                                                <td>

                                                    <span
                                                        className={
                                                            latest
                                                                ? "payroll-status paid"
                                                                : "payroll-status pending"
                                                        }
                                                    >

                                                        {
                                                            latest
                                                                ? "Generated"
                                                                : "Pending"
                                                        }

                                                    </span>

                                                </td>

                                            </tr>

                                        );

                                    }
                                )

                            )}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* GENERATE PAYROLL FORM */}

            {showPayrollForm && (

                <div className="payroll-form-card">

                    <div className="payroll-form-header">

                        <div>

                            <h3>
                                Generate Payroll
                            </h3>

                            <p>
                                Create a salary record for an employee.
                            </p>

                        </div>


                        <button
                            type="button"
                            onClick={() =>
                                setShowPayrollForm(false)
                            }
                            disabled={submitting}
                        >
                            ×
                        </button>

                    </div>


                    <form
                        onSubmit={
                            handleGeneratePayroll
                        }
                    >


                        {/* EMPLOYEE */}

                        <div className="payroll-form-row">

                            <div className="payroll-form-group">

                                <label>
                                    Employee
                                </label>

                                <select
                                    name="employeeId"
                                    value={
                                        formData.employeeId
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                    disabled={
                                        submitting
                                    }
                                >

                                    <option value="">
                                        Select Employee
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
                                                {employee.employeeId}

                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            <div className="payroll-form-group">

                                <label>
                                    Payroll Month
                                </label>

                                <input
                                    type="month"
                                    name="month"
                                    value={
                                        formData.month
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


                        {/* BASIC */}

                        <div className="salary-source">

                            <span>
                                Basic Salary
                            </span>

                            <strong>
                                ₹{" "}
                                {basicSalary.toLocaleString(
                                    "en-IN"
                                )}
                            </strong>

                            <small>
                                Set from Employee record
                            </small>

                        </div>


                        {/* ALLOWANCES */}

                        <h4 className="payroll-section-title">
                            Allowances
                        </h4>


                        <div className="payroll-form-grid">

                            {[
                                ["hra", "HRA"],
                                ["medical", "Medical"],
                                ["travel", "Travel"],
                                ["special", "Special Allowance"],
                                ["bonus", "Bonus"],
                            ].map(
                                ([name, label]) => (

                                    <div
                                        className="payroll-form-group"
                                        key={name}
                                    >

                                        <label>
                                            {label}
                                        </label>

                                        <input
                                            type="number"
                                            min="0"
                                            name={name}
                                            value={
                                                formData[name]
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={
                                                submitting
                                            }
                                        />

                                    </div>

                                )
                            )}

                        </div>


                        {/* DEDUCTIONS */}

                        <h4 className="payroll-section-title">
                            Deductions
                        </h4>


                        <div className="payroll-form-grid">

                            {[
                                ["pf", "PF"],
                                ["tax", "Tax"],
                                ["other", "Other Deduction"],
                            ].map(
                                ([name, label]) => (

                                    <div
                                        className="payroll-form-group"
                                        key={name}
                                    >

                                        <label>
                                            {label}
                                        </label>

                                        <input
                                            type="number"
                                            min="0"
                                            name={name}
                                            value={
                                                formData[name]
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={
                                                submitting
                                            }
                                        />

                                    </div>

                                )
                            )}

                        </div>


                        {/* CALCULATION */}

                        <div className="payroll-calculation">

                            <div>

                                <span>
                                    Basic Salary
                                </span>

                                <strong>
                                    ₹{" "}
                                    {basicSalary.toLocaleString(
                                        "en-IN"
                                    )}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Total Allowances
                                </span>

                                <strong>
                                    ₹{" "}
                                    {totalAllowances.toLocaleString(
                                        "en-IN"
                                    )}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Gross Salary
                                </span>

                                <strong>
                                    ₹{" "}
                                    {grossSalary.toLocaleString(
                                        "en-IN"
                                    )}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Total Deductions
                                </span>

                                <strong>
                                    ₹{" "}
                                    {totalDeductions.toLocaleString(
                                        "en-IN"
                                    )}
                                </strong>

                            </div>


                            <div className="net-salary-row">

                                <span>
                                    Net Salary
                                </span>

                                <strong>
                                    ₹{" "}
                                    {netSalary.toLocaleString(
                                        "en-IN"
                                    )}
                                </strong>

                            </div>

                        </div>


                        {/* BUTTONS */}

                        <div className="payroll-form-actions">

                            <button
                                type="button"
                                className="payroll-cancel-btn"
                                onClick={() =>
                                    setShowPayrollForm(false)
                                }
                                disabled={submitting}
                            >

                                Cancel

                            </button>


                            <button
                                type="submit"
                                className="payroll-save-btn"
                                disabled={submitting}
                            >

                                {submitting
                                    ? "Generating..."
                                    : "Generate Payroll"
                                }

                            </button>

                        </div>

                    </form>

                </div>

            )}

        </section>

    );

};


export default AdminPayroll;