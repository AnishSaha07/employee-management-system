import "./BankDetailsCard.css";

import {
    FaUniversity,
    FaUser,
    FaCreditCard,
    FaCodeBranch,
    FaMobileAlt,
    FaExclamationTriangle,
} from "react-icons/fa";

import { useEmployees } from "../../../context/EmployeeContext";

const BankDetailsCard = () => {

    const {
        currentEmployee,
    } = useEmployees();

    const employee = currentEmployee;

    if (!employee) return null;


    const bank =
        employee.bankDetails || {};


    const maskAccountNumber = (
        accountNumber
    ) => {

        if (!accountNumber) {
            return "--";
        }

        const value =
            String(accountNumber);

        if (value.length <= 4) {
            return value;
        }

        return (
            "XXXX XXXX " +
            value.slice(-4)
        );
    };


    const isBankDetailsCompleted =
        Boolean(
            bank.bankName &&
            bank.accountHolder &&
            bank.accountNumber &&
            bank.ifsc &&
            bank.branch
        );


    return (
        <div className="bank-details-card">

            <div className="bank-header">

                <div>

                    <h3>
                        Bank Details
                    </h3>

                    <p>
                        Salary payment account information.
                    </p>

                </div>


                {!isBankDetailsCompleted && (

                    <div className="bank-warning">

                        <FaExclamationTriangle />

                        Incomplete

                    </div>

                )}

            </div>


            <div className="bank-grid">

                <div className="bank-item">

                    <FaUniversity />

                    <div>

                        <span>
                            Bank Name
                        </span>

                        <strong>
                            {bank.bankName || "--"}
                        </strong>

                    </div>

                </div>


                <div className="bank-item">

                    <FaUser />

                    <div>

                        <span>
                            Account Holder
                        </span>

                        <strong>
                            {bank.accountHolder || "--"}
                        </strong>

                    </div>

                </div>


                <div className="bank-item">

                    <FaCreditCard />

                    <div>

                        <span>
                            Account Number
                        </span>

                        <strong>
                            {maskAccountNumber(
                                bank.accountNumber
                            )}
                        </strong>

                    </div>

                </div>


                <div className="bank-item">

                    <FaCodeBranch />

                    <div>

                        <span>
                            IFSC Code
                        </span>

                        <strong>
                            {bank.ifsc || "--"}
                        </strong>

                    </div>

                </div>


                <div className="bank-item">

                    <FaUniversity />

                    <div>

                        <span>
                            Branch
                        </span>

                        <strong>
                            {bank.branch || "--"}
                        </strong>

                    </div>

                </div>


                <div className="bank-item">

                    <FaMobileAlt />

                    <div>

                        <span>
                            UPI ID
                        </span>

                        <strong>
                            {bank.upiId || "--"}
                        </strong>

                    </div>

                </div>

            </div>


            {!isBankDetailsCompleted && (

                <div className="bank-note">

                    Complete your bank details to receive salary payments without delays.

                </div>

            )}

        </div>
    );
};

export default BankDetailsCard;