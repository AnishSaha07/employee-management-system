import { useMemo, useState } from "react";

import "./EmployeeInformationReport.css";

import {
    FaUser,
    FaBriefcase,
    FaUniversity,
    FaMoneyBillWave,
    FaCalendarCheck,
    FaUmbrellaBeach,
    FaTasks,
    FaEye,
} from "react-icons/fa";

import { useEmployees } from "../../../context/EmployeeContext";
import { useAttendance } from "../../../context/AttendenceContext";
import { useLeave } from "../../../context/LeaveContext";
import { useTask } from "../../../context/TaskContext";
import { usePayroll } from "../../../context/PayrollContext";

const EmployeeInformationReport = () => {
    const {
        employees = [],
        loading: employeesLoading,
    } = useEmployees();

    const {
        attendance = [],
        loading: attendanceLoading,
    } = useAttendance();

    const {
        getEmployeeLeaves,
    } = useLeave();

    const {
        getEmployeeTasks,
    } = useTask();

    const {
        payrollRecords = [],
        loading: payrollLoading,
        fetchAllPayroll,
    } = usePayroll();

    const [selectedEmployeeId, setSelectedEmployeeId] =
        useState("");

    /*
    ==========================================
            EMPLOYEE SELECTION
    ==========================================
    */

    const employeeList = useMemo(() => {
        return employees.filter(
            (employee) =>
                employee.role === "employee"
        );
    }, [employees]);

    const selectedEmployee = useMemo(() => {
        return employees.find(
            (employee) =>
                employee.employeeId ===
                selectedEmployeeId
        );
    }, [
        employees,
        selectedEmployeeId,
    ]);

    /*
    ==========================================
                PAYROLL RECORDS
    ==========================================
    */

    const employeePayrolls = useMemo(() => {
        if (!selectedEmployee) {
            return [];
        }

        return payrollRecords
            .filter(
                (payroll) =>
                    payroll.employeeId ===
                    selectedEmployee.employeeId
            )
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
        selectedEmployee,
    ]);

    const latestPayroll =
        employeePayrolls[0] || null;

    /*
    ==========================================
                ATTENDANCE
    ==========================================
    */

    const employeeAttendance = useMemo(() => {
        if (!selectedEmployee) {
            return [];
        }

        return attendance.filter(
            (record) =>
                record.employeeId ===
                selectedEmployee.employeeId
        );
    }, [
        attendance,
        selectedEmployee,
    ]);

    const presentDays =
        employeeAttendance.filter(
            (record) =>
                record.status === "Present"
        ).length;

    const absentDays =
        employeeAttendance.filter(
            (record) =>
                record.status === "Absent"
        ).length;

    const lateDays =
        employeeAttendance.filter(
            (record) =>
                record.status === "Late"
        ).length;

    const attendancePercentage =
        employeeAttendance.length > 0
            ? Math.round(
                  (presentDays /
                      employeeAttendance.length) *
                      100
              )
            : 0;

    /*
    ==========================================
                    LEAVES
    ==========================================
    */

    const employeeLeaves =
        selectedEmployee
            ? getEmployeeLeaves(
                  selectedEmployee.employeeId
              ) || []
            : [];

    const approvedLeaves =
        employeeLeaves.filter(
            (leave) =>
                leave.status ===
                "Approved"
        ).length;

    const pendingLeaves =
        employeeLeaves.filter(
            (leave) =>
                leave.status ===
                "Pending"
        ).length;

    const rejectedLeaves =
        employeeLeaves.filter(
            (leave) =>
                leave.status ===
                "Rejected"
        ).length;

    /*
    ==========================================
                    TASKS
    ==========================================
    */

    const employeeTasks =
        selectedEmployee
            ? getEmployeeTasks(
                  selectedEmployee.employeeId
              ) || []
            : [];

    const completedTasks =
        employeeTasks.filter(
            (task) =>
                task.status ===
                "Completed"
        ).length;

    const pendingTasks =
        employeeTasks.filter(
            (task) =>
                task.status ===
                "Pending"
        ).length;

    const inProgressTasks =
        employeeTasks.filter(
            (task) =>
                task.status ===
                "In Progress"
        ).length;

    const failedTasks =
        employeeTasks.filter(
            (task) =>
                task.status ===
                "Failed"
        ).length;

    /*
    ==========================================
                    PAYROLL
    ==========================================
    */

    const basicSalary = Number(
        latestPayroll?.basic ??
            selectedEmployee?.basicSalary ??
            selectedEmployee?.salary ??
            0
    );

    const allowances =
        Number(
            latestPayroll?.totalAllowances
        ) || 0;

    const deductions =
        Number(
            latestPayroll?.totalDeductions
        ) || 0;

    const grossSalary =
        Number(
            latestPayroll?.grossSalary
        ) || basicSalary + allowances;

    const netSalary =
        Number(
            latestPayroll?.netSalary
        ) || grossSalary - deductions;

    /*
    ==========================================
            LOAD REPORT DATA
    ==========================================
    */

    const handleEmployeeChange = async (
        employeeId
    ) => {
        setSelectedEmployeeId(
            employeeId
        );

        /*
        Fetch all payroll records if the
        selected employee's payroll is not
        currently available.
        */

        const hasEmployeePayroll =
            payrollRecords.some(
                (payroll) =>
                    payroll.employeeId ===
                    employeeId
            );

        if (
            employeeId &&
            !hasEmployeePayroll
        ) {
            await fetchAllPayroll();
        }
    };

    /*
    ==========================================
            LOADING STATE
    ==========================================
    */

    if (
        employeesLoading ||
        attendanceLoading ||
        payrollLoading
    ) {
        return (
            <div className="employee-information-report">
                <div className="report-empty-state">
                    <FaUser />

                    <h3>
                        Loading Report
                    </h3>

                    <p>
                        Loading employee
                        information...
                    </p>
                </div>
            </div>
        );
    }

    /*
    ==========================================
            NO EMPLOYEE SELECTED
    ==========================================
    */

    if (!selectedEmployee) {
        return (
            <div className="employee-information-report">

                <div className="report-section-header">
                    <div>
                        <h3>
                            Employee Information
                            Report
                        </h3>

                        <p>
                            Select an employee to
                            view their complete HR
                            information.
                        </p>
                    </div>

                    <div className="report-icon">
                        <FaUser />
                    </div>
                </div>

                <div className="employee-selector">
                    <label>
                        Select Employee
                    </label>

                    <select
                        value={
                            selectedEmployeeId
                        }
                        onChange={(e) =>
                            handleEmployeeChange(
                                e.target.value
                            )
                        }
                    >
                        <option value="">
                            Choose an employee
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

                <div className="report-empty-state">
                    <FaUser />

                    <h3>
                        No Employee Selected
                    </h3>

                    <p>
                        Select an employee above
                        to generate their complete
                        information report.
                    </p>
                </div>
            </div>
        );
    }

    /*
    ==========================================
                MAIN REPORT
    ==========================================
    */

    return (
        <div className="employee-information-report">

            {/* HEADER */}

            <div className="report-section-header">
                <div>
                    <h3>
                        Employee Information
                        Report
                    </h3>

                    <p>
                        Complete HR information
                        for the selected employee.
                    </p>
                </div>

                <div className="report-icon">
                    <FaUser />
                </div>
            </div>

            {/* EMPLOYEE SELECTOR */}

            <div className="employee-selector">
                <label>
                    Employee
                </label>

                <select
                    value={
                        selectedEmployeeId
                    }
                    onChange={(e) =>
                        handleEmployeeChange(
                            e.target.value
                        )
                    }
                >
                    <option value="">
                        Choose an employee
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

            {/* PROFILE HEADER */}

            <div className="employee-report-profile">

                <div className="employee-report-avatar">
                    {selectedEmployee.profileImage ? (
                        <img
                            src={
                                selectedEmployee.profileImage
                            }
                            alt={
                                selectedEmployee.name
                            }
                        />
                    ) : (
                        <span>
                            {selectedEmployee.name
                                ?.charAt(0)
                                .toUpperCase() ||
                                "E"}
                        </span>
                    )}
                </div>

                <div className="employee-report-name">

                    <h2>
                        {
                            selectedEmployee.name
                        }
                    </h2>

                    <p>
                        {
                            selectedEmployee.designation ||
                            "--"
                        }
                    </p>

                    <span>
                        Employee ID:{" "}
                        {
                            selectedEmployee.employeeId ||
                            "--"
                        }
                    </span>

                </div>

                <div className="employee-report-status">
                    {
                        selectedEmployee.status ||
                        "Active"
                    }
                </div>

            </div>

            {/* PERSONAL INFORMATION */}

            <ReportSection
                icon={<FaUser />}
                title="Personal Information"
            >
                <InfoItem
                    label="Full Name"
                    value={
                        selectedEmployee.name
                    }
                />

                <InfoItem
                    label="Email"
                    value={
                        selectedEmployee.email
                    }
                />

                <InfoItem
                    label="Phone"
                    value={
                        selectedEmployee.phone
                    }
                />

                <InfoItem
                    label="Gender"
                    value={
                        selectedEmployee.gender
                    }
                />

                <InfoItem
                    label="Date of Birth"
                    value={
                        selectedEmployee.dateOfBirth
                    }
                />

                <InfoItem
                    label="Address"
                    value={
                        formatObjectValue(
                            selectedEmployee.address
                        )
                    }
                />

                {/* FIXED EMERGENCY CONTACT */}

                <InfoItem
                    label="Emergency Contact Name"
                    value={
                        selectedEmployee
                            .emergencyContact
                            ?.name
                    }
                />

                <InfoItem
                    label="Emergency Contact Relationship"
                    value={
                        selectedEmployee
                            .emergencyContact
                            ?.relationship
                    }
                />

                <InfoItem
                    label="Emergency Contact Phone"
                    value={
                        selectedEmployee
                            .emergencyContact
                            ?.phone
                    }
                />
            </ReportSection>

            {/* EMPLOYMENT INFORMATION */}

            <ReportSection
                icon={<FaBriefcase />}
                title="Employment Information"
            >
                <InfoItem
                    label="Employee ID"
                    value={
                        selectedEmployee.employeeId
                    }
                />

                <InfoItem
                    label="Department"
                    value={
                        selectedEmployee.department
                    }
                />

                <InfoItem
                    label="Designation"
                    value={
                        selectedEmployee.designation
                    }
                />

                <InfoItem
                    label="Role"
                    value={
                        selectedEmployee.role
                    }
                />

                <InfoItem
                    label="Joining Date"
                    value={
                        selectedEmployee.joiningDate
                    }
                />

                <InfoItem
                    label="Employment Status"
                    value={
                        selectedEmployee.status
                    }
                />

                <InfoItem
                    label="Basic Salary"
                    value={`₹ ${basicSalary.toLocaleString(
                        "en-IN"
                    )}`}
                />
            </ReportSection>

            {/* BANK DETAILS */}

            <ReportSection
                icon={<FaUniversity />}
                title="Bank Details"
            >
                <InfoItem
                    label="Bank Name"
                    value={
                        selectedEmployee
                            .bankDetails
                            ?.bankName
                    }
                />

                <InfoItem
                    label="Account Number"
                    value={
                        selectedEmployee
                            .bankDetails
                            ?.accountNumber
                    }
                />

                <InfoItem
                    label="IFSC Code"
                    value={
                        selectedEmployee
                            .bankDetails
                            ?.ifsc
                    }
                />
            </ReportSection>

            {/* PAYROLL */}

            <ReportSection
                icon={<FaMoneyBillWave />}
                title="Payroll Summary"
            >
                <InfoItem
                    label="Basic Salary"
                    value={`₹ ${basicSalary.toLocaleString(
                        "en-IN"
                    )}`}
                />

                <InfoItem
                    label="Allowances"
                    value={`₹ ${allowances.toLocaleString(
                        "en-IN"
                    )}`}
                />

                <InfoItem
                    label="Deductions"
                    value={`₹ ${deductions.toLocaleString(
                        "en-IN"
                    )}`}
                />

                <InfoItem
                    label="Gross Salary"
                    value={`₹ ${grossSalary.toLocaleString(
                        "en-IN"
                    )}`}
                />

                <InfoItem
                    label="Net Salary"
                    value={`₹ ${netSalary.toLocaleString(
                        "en-IN"
                    )}`}
                    highlight
                />

                <InfoItem
                    label="Latest Payroll Month"
                    value={
                        latestPayroll?.month ||
                        "--"
                    }
                />

                <InfoItem
                    label="Payment Status"
                    value={
                        latestPayroll?.status ||
                        "Pending"
                    }
                />
            </ReportSection>

            {/* ATTENDANCE */}

            <ReportSection
                icon={<FaCalendarCheck />}
                title="Attendance Summary"
            >
                <InfoItem
                    label="Total Days"
                    value={
                        employeeAttendance.length
                    }
                />

                <InfoItem
                    label="Present"
                    value={presentDays}
                />

                <InfoItem
                    label="Absent"
                    value={absentDays}
                />

                <InfoItem
                    label="Late"
                    value={lateDays}
                />

                <InfoItem
                    label="Attendance Percentage"
                    value={`${attendancePercentage}%`}
                    highlight
                />
            </ReportSection>

            {/* LEAVE */}

            <ReportSection
                icon={<FaUmbrellaBeach />}
                title="Leave Summary"
            >
                <InfoItem
                    label="Total Requests"
                    value={
                        employeeLeaves.length
                    }
                />

                <InfoItem
                    label="Approved"
                    value={
                        approvedLeaves
                    }
                />

                <InfoItem
                    label="Pending"
                    value={
                        pendingLeaves
                    }
                />

                <InfoItem
                    label="Rejected"
                    value={
                        rejectedLeaves
                    }
                />
            </ReportSection>

            {/* TASKS */}

            <ReportSection
                icon={<FaTasks />}
                title="Task Summary"
            >
                <InfoItem
                    label="Total Tasks"
                    value={
                        employeeTasks.length
                    }
                />

                <InfoItem
                    label="Pending"
                    value={
                        pendingTasks
                    }
                />

                <InfoItem
                    label="In Progress"
                    value={
                        inProgressTasks
                    }
                />

                <InfoItem
                    label="Completed"
                    value={
                        completedTasks
                    }
                    highlight
                />

                <InfoItem
                    label="Failed"
                    value={
                        failedTasks
                    }
                />
            </ReportSection>

            {/* REPORT FOOTER */}

            <div className="report-footer">

                <span>
                    Report generated on{" "}
                    {new Date().toLocaleDateString(
                        "en-IN"
                    )}
                </span>

                <button
                    type="button"
                    className="view-report-btn"
                >
                    <FaEye />
                    Full Report
                </button>

            </div>

        </div>
    );
};

/*
==========================================
        OBJECT VALUE FORMATTER
==========================================
*/

const formatObjectValue = (value) => {
    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        return "--";
    }

    if (
        typeof value === "object"
    ) {
        return Object.values(value)
            .filter(
                (item) =>
                    item !== undefined &&
                    item !== null &&
                    item !== ""
            )
            .join(", ");
    }

    return value;
};

/*
==========================================
        SMALL COMPONENTS
==========================================
*/

const ReportSection = ({
    icon,
    title,
    children,
}) => {
    return (
        <div className="employee-report-section">

            <div className="employee-report-section-header">

                <div className="section-title-icon">
                    {icon}
                </div>

                <h3>
                    {title}
                </h3>

            </div>

            <div className="employee-report-grid">
                {children}
            </div>

        </div>
    );
};

const InfoItem = ({
    label,
    value,
    highlight = false,
}) => {

    const displayValue =
        value !== undefined &&
        value !== null &&
        value !== ""
            ? typeof value === "object"
                ? formatObjectValue(value)
                : value
            : "--";

    return (
        <div
            className={`report-info-item ${
                highlight
                    ? "highlight"
                    : ""
            }`}
        >
            <span>
                {label}
            </span>

            <strong>
                {displayValue}
            </strong>
        </div>
    );
};

export default EmployeeInformationReport;