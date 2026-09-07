import "./SalaryBreakdown.css";

import {
    FaWallet,
    FaPlusCircle,
    FaMinusCircle,
} from "react-icons/fa";

const SalaryBreakdown = ({ payroll }) => {

    if (!payroll) return null;


    /* =================================
            ALLOWANCES
    ================================= */

    const allowances = payroll.allowances || {};

    const hra =
        Number(allowances.hra) || 0;

    const medical =
        Number(allowances.medical) || 0;

    const travel =
        Number(allowances.travel) || 0;

    const special =
        Number(allowances.special) || 0;

    const bonus =
        Number(allowances.bonus) || 0;


    /* =================================
            DEDUCTIONS
    ================================= */

    const deductions = payroll.deductions || {};

    const pf =
        Number(deductions.pf) || 0;

    const tax =
        Number(deductions.tax) || 0;

    const other =
        Number(deductions.other) || 0;


    /* =================================
            BREAKDOWN
    ================================= */

    const breakdown = [

        {
            title: "Basic Salary",
            amount: Number(payroll.basic) || 0,
            type: "earning",
        },

        {
            title: "House Rent Allowance",
            amount: hra,
            type: "earning",
        },

        {
            title: "Medical Allowance",
            amount: medical,
            type: "earning",
        },

        {
            title: "Travel Allowance",
            amount: travel,
            type: "earning",
        },

        {
            title: "Special Allowance",
            amount: special,
            type: "earning",
        },

        {
            title: "Bonus",
            amount: bonus,
            type: "earning",
        },

        {
            title: "Provident Fund",
            amount: pf,
            type: "deduction",
        },

        {
            title: "Tax",
            amount: tax,
            type: "deduction",
        },

        {
            title: "Other Deduction",
            amount: other,
            type: "deduction",
        },

    ];


    return (

        <div className="salary-breakdown-card">

            {/* HEADER */}

            <div className="salary-header">

                <div>

                    <h3>
                        Salary Breakdown
                    </h3>

                    <p>
                        {payroll.month}
                    </p>

                </div>

                <FaWallet />

            </div>


            {/* BREAKDOWN */}

            <div className="salary-list">

                {breakdown.map((item) => (

                    <div
                        key={item.title}
                        className="salary-row"
                    >

                        <div className="salary-title">

                            {

                                item.type === "earning"

                                    ? (
                                        <FaPlusCircle
                                            className="earning-icon"
                                        />
                                    )

                                    : (
                                        <FaMinusCircle
                                            className="deduction-icon"
                                        />
                                    )

                            }

                            <span>
                                {item.title}
                            </span>

                        </div>

                        <strong>

                            ₹ {item.amount.toLocaleString("en-IN")}

                        </strong>

                    </div>

                ))}

            </div>


            {/* FOOTER */}

            <div className="salary-footer">

                <span>
                    Net Salary
                </span>

                <h2>

                    ₹ {
                        Number(
                            payroll.netSalary || 0
                        ).toLocaleString("en-IN")
                    }

                </h2>

            </div>

        </div>

    );

};

export default SalaryBreakdown;