import React, { useState } from "react";
import "./AddEmployeeModal.css";

import Modal from "../../../common/Modal";
import { useToast } from "../../../context/ToastContext";
import { useEmployees } from "../../../context/EmployeeContext";

import {
    generateEmployeeId,
    generateCompanyEmail,
} from "../../../utils/idGenerator";

const INITIAL_STATE = {
    name: "",
    department: "",
    designation: "",
    role: "employee",
    salary: "",
    password: "",

    // Personal Information
    phone: "",
    gender: "",
    dob: "",
    address: "",
    emergencyContact: "",

    // Bank Information
    bankName: "",
    accountHolder: "",
    accountNumber: "",
    confirmAccountNumber: "",
    ifsc: "",
    branch: "",
    upiId: "",
};

const AddEmployeeModal = ({
    open,
    onClose,
    employee = null,
}) => {

    const { addEmployee, updateEmployee, } = useEmployees();

    const { showToast } = useToast();

    const [formData, setFormData] = useState(
    employee
        ? {
    name: employee.name,
    department: employee.department,
    designation: employee.designation,
    role: employee.role,

    salary: employee.basicSalary,

    password: employee.password,

    phone: employee.phone || "",
    gender: employee.gender || "",
    dob: employee.dob || "",
    address: employee.address || "",
    emergencyContact: employee.emergencyContact || "",

    bankName: employee.bankDetails?.bankName || "",
    accountHolder: employee.bankDetails?.accountHolder || "",
    accountNumber: employee.bankDetails?.accountNumber || "",
    confirmAccountNumber:
        employee.bankDetails?.accountNumber || "",
    ifsc: employee.bankDetails?.ifsc || "",
    branch: employee.bankDetails?.branch || "",
    upiId: employee.bankDetails?.upiId || "",
}
        : INITIAL_STATE
);

    const employeeId =
        employee?.employeeId ||
        (open ? generateEmployeeId(formData.role) : "");

    const companyEmail =
        employee?.email ||
        (formData.name.trim() === ""
            ? ""
            : generateCompanyEmail(formData.name, employeeId));
  /* ===========================
      HANDLE CHANGE
  =========================== */

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({

      ...prev,

      [name]: value,

    }));

  };

  /* ===========================
      SUBMIT
  =========================== */

  const handleSubmit = (e) => {

    e.preventDefault();

    const employeeData = {

    id: employee?.id || Date.now(),

    employeeId: employee?.employeeId || employeeId,

    email: employee?.email || companyEmail,

    attendance: employee?.attendance || "Absent",

    leaveStatus: employee?.leaveStatus ?? false,

    status: employee?.status || "Active",

    joiningDate:
        employee?.joiningDate ||
        new Date().toLocaleDateString(),

    tasks: employee?.tasks || [],

    ...formData,

    basicSalary: Number(formData.salary),

    // Personal Information
    phone: formData.phone,
    gender: formData.gender,
    dob: formData.dob,
    address: formData.address,
    emergencyContact: formData.emergencyContact,

    profileImage:
        employee?.profileImage || "",

    // Bank Information
    bankDetails: {

        bankName: formData.bankName,

        accountHolder: formData.accountHolder,

        accountNumber: formData.accountNumber,

        ifsc: formData.ifsc,

        branch: formData.branch,

        upiId: formData.upiId,

    },

    // Payroll
    allowances: employee?.allowances || {

        hra: 0,

        medical: 0,

        travel: 0,

        special: 0,

    },

    deductions: employee?.deductions || {

        pf: 0,

        tax: 0,

        other: 0,

    },

    payrollHistory:
        employee?.payrollHistory || [],

};
    if (employee) {

        updateEmployee(employeeData);

        showToast(

            "success",

            "Employee Updated",

            `${employeeData.name} updated successfully.`

        );

    } else {

        addEmployee(employeeData);

        showToast(

            "success",

            "Employee Created",

            `${employeeData.name} added successfully.`

        );

    }

    setFormData(INITIAL_STATE);

    onClose();

};

  return (

    <Modal
      open={open}
      title={employee ? "Edit Employee" : "Create Employee"}
      onClose={onClose}
    >

      <form
        className="employee-form"
        onSubmit={handleSubmit}
      >

        {/* NAME */}

        <div className="form-group">

          <label>

            Full Name

          </label>

          <input
            type="text"
            name="name"
            placeholder="Enter employee name"
            value={formData.name}
            onChange={handleChange}
            required
          />

        </div>

        {/* ROW */}

        <div className="form-row">

          <div className="form-group">

            <label>

              Department

            </label>

            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="IT"
              required
            />

          </div>

          <div className="form-group">

            <label>

              Designation

            </label>

            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              placeholder="Software Engineer"
              required
            />

          </div>

        </div>

        {/* ROW */}

        <div className="form-row">

          <div className="form-group">

            <label>

              Role

            </label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >

              <option value="employee">

                Employee

              </option>

              <option value="admin">

                Admin

              </option>

            </select>

          </div>

          <div className="form-group">

            <label>

              Salary

            </label>

            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="00000"
              required
            />

          </div>

        </div>

        {/* PASSWORD */}

        <div className="form-group">

          <label>

            Initial Password

          </label>

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

        </div>

        {/* AUTO GENERATED */}

        <div className="generated-box">

          <div>

            <span>Employee ID</span>

            <h4>{employeeId}</h4>

          </div>

          <div>

            <span>Company Email</span>

            <h4>{companyEmail || "Generated Automatically"}</h4>

          </div>

        </div>

        {/* BUTTONS */}

        <div className="form-buttons">

          <button
            type="button"
            className="cancel-btn"
            onClick={onClose}
          >

            Cancel

          </button>

          <button
            type="submit"
            className="create-btn"
          >

            {employee ? "Update Employee" : "Create Employee"}

          </button>

        </div>

      </form>

    </Modal>

  );

};

export default AddEmployeeModal;