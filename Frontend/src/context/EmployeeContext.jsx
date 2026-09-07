/* eslint-disable react-refresh/only-export-components */

import React, {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import {
    getEmployees as fetchEmployees,
    getCurrentEmployee as fetchCurrentEmployee,
    createEmployee as apiCreateEmployee,
    updateEmployee as apiUpdateEmployee,
    updateMyProfile as apiUpdateMyProfile,
    deleteEmployee as apiDeleteEmployee,
    updateEmployeeSalary as apiUpdateEmployeeSalary,
} from "../services/employeeService";

const EmployeeContext = createContext();

export const EmployeeProvider = ({ children }) => {

    const [employees, setEmployees] = useState([]);

    const [currentEmployee, setCurrentEmployee] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);


    /* ==========================================
       INITIAL LOAD
    ========================================== */

    useEffect(() => {

        let cancelled = false;

        const loadInitialData = async () => {

            try {

                setLoading(true);
                setError(null);

                const currentResponse =
                    await fetchCurrentEmployee();

                if (cancelled) return;

                if (
                    currentResponse.success &&
                    currentResponse.employee
                ) {

                    setCurrentEmployee(
                        currentResponse.employee
                    );

                    /*
                        Only admin needs the
                        complete employee list.
                    */

                    if (
                        currentResponse.employee.role ===
                        "admin"
                    ) {

                        try {

                            const response =
                                await fetchEmployees();

                            if (
                                response.success &&
                                !cancelled
                            ) {

                                setEmployees(
                                    response.employees || []
                                );

                            }

                        } catch (error) {

                            console.error(
                                "Failed to load employees:",
                                error
                            );

                            if (!cancelled) {

                                setError(
                                    error.response?.data?.message ||
                                    "Failed to load employees."
                                );
                            }
                        }
                    }

                } else {

                    setError(
                        currentResponse.message ||
                        "Failed to load current employee."
                    );
                }

            } catch (error) {

                if (cancelled) return;

                console.error(
                    "Initial employee load error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load employee information."
                );

            } finally {

                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadInitialData();

        return () => {
            cancelled = true;
        };

    }, []);


    /* ==========================================
       REFRESH ALL EMPLOYEES
       ADMIN ONLY
    ========================================== */

    const refreshEmployees = async () => {

        try {

            setLoading(true);
            setError(null);

            const response =
                await fetchEmployees();

            if (!response.success) {

                throw new Error(
                    response.message ||
                    "Failed to load employees."
                );
            }

            setEmployees(
                response.employees || []
            );

            return response.employees || [];

        } catch (error) {

            console.error(
                "Refresh employees error:",
                error
            );

            setError(
                error.response?.data?.message ||
                error.message ||
                "Failed to load employees."
            );

            throw error;

        } finally {

            setLoading(false);
        }
    };


    /* ==========================================
       GET CURRENT EMPLOYEE
       EXPLICIT API REFRESH
    ========================================== */

   const getCurrentEmployee = () => {
    return currentEmployee;
};


    /* ==========================================
       UPDATE MY PROFILE
       EMPLOYEE / LOGGED-IN USER
    ========================================== */

    const updateMyProfile = async (
        profileData
    ) => {

        try {

            const response =
                await apiUpdateMyProfile(
                    profileData
                );

            if (!response.success) {

                throw new Error(
                    response.message ||
                    "Failed to update profile."
                );
            }

            const updatedEmployee =
                response.employee;

            /*
                Update the logged-in employee
                immediately.
            */

            setCurrentEmployee(
                updatedEmployee
            );

            /*
                If the employee exists in the
                admin employee list, update it.
            */

            setEmployees(prev =>
                prev.map(employee =>
                    employee._id ===
                    updatedEmployee._id
                        ? updatedEmployee
                        : employee
                )
            );

            return updatedEmployee;

        } catch (error) {

            console.error(
                "Update profile error:",
                error
            );

            throw error;
        }
    };


    /* ==========================================
       ADD EMPLOYEE
       ADMIN ONLY
    ========================================== */

    const addEmployee = async (
        employee
    ) => {

        try {

            const response =
                await apiCreateEmployee(
                    employee
                );

            if (!response.success) {

                throw new Error(
                    response.message ||
                    "Failed to create employee."
                );
            }

            const createdEmployee =
                response.employee;

            setEmployees(prev => [
                ...prev,
                createdEmployee,
            ]);

            return createdEmployee;

        } catch (error) {

            console.error(
                "Create employee error:",
                error
            );

            throw error;
        }
    };


    /* ==========================================
       DELETE EMPLOYEE
       ADMIN ONLY
    ========================================== */

    const deleteEmployee = async (id) => {

        try {

            const response =
                await apiDeleteEmployee(id);

            if (!response.success) {

                throw new Error(
                    response.message ||
                    "Failed to delete employee."
                );
            }

            setEmployees(prev =>
                prev.filter(
                    employee =>
                        employee._id !== id
                )
            );

        } catch (error) {

            console.error(
                "Delete employee error:",
                error
            );

            throw error;
        }
    };


    /* ==========================================
       UPDATE EMPLOYEE
       ADMIN ONLY
    ========================================== */

    const updateEmployee = async (
        updatedEmployee
    ) => {

        try {

            const id =
                updatedEmployee._id ||
                updatedEmployee.id;

            if (!id) {

                throw new Error(
                    "Employee ID is required."
                );
            }

            const response =
                await apiUpdateEmployee(
                    id,
                    updatedEmployee
                );

            if (!response.success) {

                throw new Error(
                    response.message ||
                    "Failed to update employee."
                );
            }

            const updated =
                response.employee;

            setEmployees(prev =>
                prev.map(employee =>
                    employee._id === id
                        ? updated
                        : employee
                )
            );

            return updated;

        } catch (error) {

            console.error(
                "Update employee error:",
                error
            );

            throw error;
        }
    };


    /* ==========================================
       GET EMPLOYEE BY MONGODB ID
       LOCAL LOOKUP ONLY
    ========================================== */

    const getEmployeeById = (id) => {

        return employees.find(
            employee =>
                employee._id === id
        );
    };


    /* ==========================================
       GET EMPLOYEE BY BUSINESS EMPLOYEE ID
       LOCAL LOOKUP ONLY
    ========================================== */

    const getEmployeeByEmployeeId = (
        employeeId
    ) => {

        return employees.find(
            employee =>
                employee.employeeId === employeeId
        );
    };


    /* ==========================================
       UPDATE SALARY
       ADMIN ONLY
    ========================================== */

    const updateEmployeeSalary = async (
        employeeId,
        salaryData
    ) => {

        try {

            const employee =
                employees.find(
                    emp =>
                        emp.employeeId === employeeId
                );

            if (!employee) {

                throw new Error(
                    "Employee not found."
                );
            }

            const response =
                await apiUpdateEmployeeSalary(
                    employee._id,
                    salaryData
                );

            if (!response.success) {

                throw new Error(
                    response.message ||
                    "Failed to update salary."
                );
            }

            const updated =
                response.employee;

            setEmployees(prev =>
                prev.map(emp =>
                    emp._id === employee._id
                        ? updated
                        : emp
                )
            );

            return updated;

        } catch (error) {

            console.error(
                "Salary update error:",
                error
            );

            throw error;
        }
    };


    /* ==========================================
       CONTEXT
    ========================================== */

    return (
        <EmployeeContext.Provider
            value={{
                employees,
                currentEmployee,
                loading,
                error,

                addEmployee,
                deleteEmployee,
                updateEmployee,

                updateMyProfile,

                getEmployeeById,
                getEmployeeByEmployeeId,

                updateEmployeeSalary,

                /*
                    This is now only for
                    explicitly refreshing /me.
                */
                getCurrentEmployee,

                refreshEmployees,
            }}
        >
            {children}
        </EmployeeContext.Provider>
    );
};


/* ==========================================
   HOOK
========================================== */

export const useEmployees = () =>
    useContext(EmployeeContext);