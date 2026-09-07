import api from "./api";

/* ==========================================
   GET ALL EMPLOYEES
========================================== */

export const getEmployees = async () => {
    const response = await api.get("/employees");
    return response.data;
};


/* ==========================================
   GET EMPLOYEE BY MONGODB ID
========================================== */

export const getEmployeeById = async (id) => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
};


/* ==========================================
   GET CURRENT LOGGED-IN EMPLOYEE
========================================== */

export const getCurrentEmployee = async () => {
    const response = await api.get("/employees/me");
    return response.data;
};


/* ==========================================
   CREATE EMPLOYEE
========================================== */

export const createEmployee = async (employeeData) => {
    const response = await api.post(
        "/employees",
        employeeData
    );

    return response.data;
};


/* ==========================================
   UPDATE EMPLOYEE
   ADMIN ONLY
========================================== */

export const updateEmployee = async (
    id,
    employeeData
) => {
    const response = await api.put(
        `/employees/${id}`,
        employeeData
    );

    return response.data;
};


/* ==========================================
   UPDATE MY PROFILE
   LOGGED-IN EMPLOYEE
========================================== */

export const updateMyProfile = async (
    profileData
) => {
    const response = await api.patch(
        "/employees/me/profile",
        profileData
    );

    return response.data;
};


/* ==========================================
   UPDATE SALARY
   ADMIN ONLY
========================================== */

export const updateEmployeeSalary = async (
    id,
    salaryData
) => {
    const response = await api.patch(
        `/employees/${id}/salary`,
        salaryData
    );

    return response.data;
};


/* ==========================================
   DELETE EMPLOYEE
========================================== */

export const deleteEmployee = async (id) => {
    const response = await api.delete(
        `/employees/${id}`
    );

    return response.data;
};