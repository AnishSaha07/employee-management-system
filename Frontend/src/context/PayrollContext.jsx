/* eslint-disable react-refresh/only-export-components */

import {
    createContext,
    useContext,
    useState,
    useCallback,
} from "react";

import api from "../services/api";


const PayrollContext = createContext();


/* ==========================================
                PROVIDER
========================================== */

export const PayrollProvider = ({ children }) => {

    const [payrollRecords, setPayrollRecords] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    /* ==========================================
                GET MY PAYROLL
                EMPLOYEE ONLY
    ========================================== */

    const fetchMyPayroll = useCallback(async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await api.get("/payroll/my");

            const payrolls =
                response.data.payrolls || [];

            setPayrollRecords(payrolls);

            return {
                success: true,
                payrolls,
            };

        } catch (error) {

            console.error(
                "Fetch my payroll error:",
                error
            );

            const message =
                error.response?.data?.message ||
                "Failed to load your payroll.";

            setError(message);

            return {
                success: false,
                message,
            };

        } finally {

            setLoading(false);

        }

    }, []);


    /* ==========================================
                GET ALL PAYROLL
                ADMIN ONLY
    ========================================== */

    const fetchAllPayroll = useCallback(async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await api.get("/payroll");

            const payrolls =
                response.data.payrolls || [];

            setPayrollRecords(payrolls);

            return {
                success: true,
                payrolls,
            };

        } catch (error) {

            console.error(
                "Fetch all payroll error:",
                error
            );

            const message =
                error.response?.data?.message ||
                "Failed to load payroll records.";

            setError(message);

            return {
                success: false,
                message,
            };

        } finally {

            setLoading(false);

        }

    }, []);


    /* ==========================================
                GENERATE PAYROLL
                ADMIN ONLY
    ========================================== */

    const generatePayroll = async (payrollData) => {

        try {

            setLoading(true);
            setError("");

            const response =
                await api.post(
                    "/payroll",
                    {
                        employeeId:
                            payrollData.employeeId,

                        month:
                            payrollData.month,

                        hra:
                            Number(payrollData.hra) || 0,

                        medical:
                            Number(payrollData.medical) || 0,

                        travel:
                            Number(payrollData.travel) || 0,

                        special:
                            Number(payrollData.special) || 0,

                        bonus:
                            Number(payrollData.bonus) || 0,

                        pf:
                            Number(payrollData.pf) || 0,

                        tax:
                            Number(payrollData.tax) || 0,

                        other:
                            Number(payrollData.other) || 0,
                    }
                );


            const newPayroll =
                response.data.payroll;


            /*
                Add backend-created payroll
                to React state.
            */

            setPayrollRecords((prev) => [
                newPayroll,
                ...prev,
            ]);


            return {

                success: true,

                payroll:
                    newPayroll,

                message:
                    response.data.message ||
                    "Payroll generated successfully.",
            };

        } catch (error) {

            console.error(
                "Generate payroll error:",
                error
            );

            const message =
                error.response?.data?.message ||
                "Failed to generate payroll.";

            setError(message);

            return {

                success: false,

                message,
            };

        } finally {

            setLoading(false);

        }

    };


    /* ==========================================
                GET PAYROLL BY ID
                EMPLOYEE / ADMIN
    ========================================== */

    const getPayrollById = async (id) => {

        try {

            setLoading(true);
            setError("");

            const response =
                await api.get(
                    `/payroll/${id}`
                );

            return {

                success: true,

                payroll:
                    response.data.payroll,
            };

        } catch (error) {

            console.error(
                "Get payroll error:",
                error
            );

            const message =
                error.response?.data?.message ||
                "Failed to fetch payroll.";

            setError(message);

            return {

                success: false,

                message,
            };

        } finally {

            setLoading(false);

        }

    };


    /* ==========================================
                REFRESH PAYROLL
    ========================================== */

    const refreshPayroll = useCallback(async () => {

        /*
            This function is useful when
            another page generates payroll
            and we want fresh database data.
        */

        try {

            setLoading(true);
            setError("");

            const response =
                await api.get("/payroll");

            const payrolls =
                response.data.payrolls || [];

            setPayrollRecords(payrolls);

            return {
                success: true,
                payrolls,
            };

        } catch (error) {

            console.error(
                "Refresh payroll error:",
                error
            );

            const message =
                error.response?.data?.message ||
                "Failed to refresh payroll.";

            setError(message);

            return {
                success: false,
                message,
            };

        } finally {

            setLoading(false);

        }

    }, []);


    /* ==========================================
                    PROVIDER
    ========================================== */

    return (

        <PayrollContext.Provider
            value={{

                /* Data */

                payrollRecords,


                /* Employee */

                fetchMyPayroll,


                /* Admin */

                fetchAllPayroll,
                generatePayroll,


                /* Common */

                getPayrollById,
                refreshPayroll,


                /* State */

                loading,
                error,
            }}
        >

            {children}

        </PayrollContext.Provider>

    );

};


/* ==========================================
                    HOOK
========================================== */

export const usePayroll = () =>
    useContext(PayrollContext);