import {
    useMemo,
    useState,
} from "react";

import "./PayrollTable.css";

import {
    FaEye,
    FaSearch,
} from "react-icons/fa";


const PayrollTable = ({
    payrollData = [],
    onView,
}) => {

    const [search, setSearch] =
        useState("");


    /* ==========================================
                    FILTER
    ========================================== */

    const filteredPayroll = useMemo(() => {

        const searchValue =
            search.trim().toLowerCase();

        return payrollData.filter(
            (payroll) =>
                String(
                    payroll.month || ""
                )
                    .toLowerCase()
                    .includes(searchValue)
        );

    }, [
        payrollData,
        search,
    ]);


    /* ==========================================
                TOTAL ALLOWANCES
    ========================================== */

    const getTotalAllowances = (payroll) => {

        /*
            New backend structure:
            
            payroll.allowances = {
                hra,
                medical,
                travel,
                special,
                bonus
            }

            Older records may have:
            
            payroll.allowance
        */

        if (payroll?.allowances) {

            return (
                Number(
                    payroll.allowances.hra
                ) || 0
            ) + (
                Number(
                    payroll.allowances.medical
                ) || 0
            ) + (
                Number(
                    payroll.allowances.travel
                ) || 0
            ) + (
                Number(
                    payroll.allowances.special
                ) || 0
            ) + (
                Number(
                    payroll.allowances.bonus
                ) || 0
            );

        }

        return Number(
            payroll?.allowance
        ) || 0;

    };


    /* ==========================================
                TOTAL DEDUCTIONS
    ========================================== */

    const getTotalDeductions = (payroll) => {

        /*
            New backend structure:
            
            payroll.deductions = {
                pf,
                tax,
                other
            }

            Older records may have:
            
            payroll.deduction
        */

        if (payroll?.deductions) {

            return (
                Number(
                    payroll.deductions.pf
                ) || 0
            ) + (
                Number(
                    payroll.deductions.tax
                ) || 0
            ) + (
                Number(
                    payroll.deductions.other
                ) || 0
            );

        }

        return Number(
            payroll?.deduction
        ) || 0;

    };


    /* ==========================================
                    TABLE
    ========================================== */

    return (

        <div className="payroll-table-card">


            {/* HEADER */}

            <div className="payroll-table-header">

                <h3>
                    Payroll History
                </h3>


                <div className="payroll-search">

                    <FaSearch />

                    <input
                        type="text"
                        placeholder="Search month..."
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                    />

                </div>

            </div>


            {/* TABLE */}

            <table className="payroll-table">

                <thead>

                    <tr>

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
                            Net Salary
                        </th>

                        <th>
                            Status
                        </th>

                        <th>
                            Action
                        </th>

                    </tr>

                </thead>


                <tbody>

                    {filteredPayroll.length === 0 ? (

                        <tr>

                            <td
                                colSpan="7"
                                className="empty-row"
                            >

                                No Payroll Records Found

                            </td>

                        </tr>

                    ) : (

                        filteredPayroll.map(
                            (payroll) => {

                                const payrollId =
                                    payroll._id ||
                                    payroll.id;


                                const basic =
                                    Number(
                                        payroll.basic
                                    ) || 0;


                                const allowance =
                                    getTotalAllowances(
                                        payroll
                                    );


                                const deduction =
                                    getTotalDeductions(
                                        payroll
                                    );


                                const netSalary =
                                    Number(
                                        payroll.netSalary
                                    ) ||
                                    (
                                        basic +
                                        allowance -
                                        deduction
                                    );


                                return (

                                    <tr
                                        key={
                                            payrollId
                                        }
                                    >


                                        {/* MONTH */}

                                        <td>

                                            {
                                                payroll.month ||
                                                "--"
                                            }

                                        </td>


                                        {/* BASIC */}

                                        <td>

                                            ₹{" "}

                                            {basic.toLocaleString(
                                                "en-IN"
                                            )}

                                        </td>


                                        {/* ALLOWANCES */}

                                        <td>

                                            ₹{" "}

                                            {allowance.toLocaleString(
                                                "en-IN"
                                            )}

                                        </td>


                                        {/* DEDUCTIONS */}

                                        <td>

                                            ₹{" "}

                                            {deduction.toLocaleString(
                                                "en-IN"
                                            )}

                                        </td>


                                        {/* NET SALARY */}

                                        <td>

                                            ₹{" "}

                                            {netSalary.toLocaleString(
                                                "en-IN"
                                            )}

                                        </td>


                                        {/* STATUS */}

                                        <td>

                                            <span
                                                className={`status-badge ${
                                                    String(
                                                        payroll.status ||
                                                        "Pending"
                                                    ).toLowerCase()
                                                }`}
                                            >

                                                {
                                                    payroll.status ||
                                                    "Pending"
                                                }

                                            </span>

                                        </td>


                                        {/* ACTION */}

                                        <td>

                                            <button
                                                type="button"
                                                className="view-btn"
                                                onClick={() =>
                                                    onView(
                                                        payroll
                                                    )
                                                }
                                            >

                                                <FaEye />

                                                View

                                            </button>

                                        </td>

                                    </tr>

                                );

                            }
                        )

                    )}

                </tbody>

            </table>

        </div>

    );

};


export default PayrollTable;