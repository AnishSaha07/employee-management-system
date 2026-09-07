import { getEmployees } from "./storage";

/* ===========================
      GENERATE EMPLOYEE ID
=========================== */

export const generateEmployeeId = (role) => {

    const employees = getEmployees();

    const prefix = role === "admin" ? "ADM" : "EMP";

    const filtered = employees.filter(
        (employee) => employee.employeeId.startsWith(prefix)
    );

    const nextNumber = filtered.length + 1;

    return `${prefix}${String(nextNumber).padStart(3, "0")}`;

};

/* ===========================
      COMPANY EMAIL
=========================== */

export const generateCompanyEmail = (
    fullName,
    employeeId
) => {

    const username = fullName
        .trim()
        .toLowerCase()
        .replace(/\s+/g, ".");

    return `${username}.${employeeId.toLowerCase()}@asgroup.com`;

};