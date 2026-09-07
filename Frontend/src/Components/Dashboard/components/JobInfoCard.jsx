import "./JobInfoCard.css";

import {
    FaIdBadge,
    FaBuilding,
    FaBriefcase,
    FaUserShield,
    FaCalendarAlt,
    FaCheckCircle,
    FaMoneyBillWave,
} from "react-icons/fa";

import { useEmployees } from "../../../context/EmployeeContext";

const JobInfoCard = () => {

    const {
        currentEmployee,
    } = useEmployees();

    const employee = currentEmployee;

    if (!employee) return null;


    const role = employee.role
        ? employee.role.charAt(0).toUpperCase() +
        employee.role.slice(1)
        : "--";


    const basicSalary = Number(
        employee.basicSalary ??
        employee.salary ??
        0
    );


    const joiningDate =
        employee.joiningDate
            ? new Date(
                employee.joiningDate
            ).toLocaleDateString("en-IN")
            : "--";


    const jobInfo = [

        {
            icon: <FaIdBadge />,
            label: "Employee ID",
            value:
                employee.employeeId || "--",
        },

        {
            icon: <FaBuilding />,
            label: "Department",
            value:
                employee.department || "--",
        },

        {
            icon: <FaBriefcase />,
            label: "Designation",
            value:
                employee.designation || "--",
        },

        {
            icon: <FaUserShield />,
            label: "Role",
            value: role,
        },

        {
            icon: <FaCalendarAlt />,
            label: "Joining Date",
            value: joiningDate,
        },

        {
            icon: <FaCheckCircle />,
            label: "Employment Status",
            value:
                employee.status || "--",
        },

        {
            icon: <FaMoneyBillWave />,
            label: "Basic Salary",
            value:
                `₹ ${basicSalary.toLocaleString(
                    "en-IN"
                )}`,
        },

    ];


    return (
        <div className="job-info-card">

            <div className="job-card-header">

                <h3>
                    Job Information
                </h3>

                <p>
                    Official employment details managed by HR.
                </p>

            </div>


            <div className="job-grid">

                {jobInfo.map(item => (

                    <div
                        key={item.label}
                        className="job-item"
                    >

                        <div className="job-icon">
                            {item.icon}
                        </div>

                        <div className="job-content">

                            <span>
                                {item.label}
                            </span>

                            <strong>
                                {item.value}
                            </strong>

                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
};

export default JobInfoCard;