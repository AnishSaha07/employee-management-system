import "./PersonalInfoCard.css";

import {
    FaUser,
    FaEnvelope,
    FaPhone,
    FaVenusMars,
    FaBirthdayCake,
    FaMapMarkerAlt,
    FaPhoneAlt,
} from "react-icons/fa";

import { useEmployees } from "../../../context/EmployeeContext";

const PersonalInfoCard = () => {

    const {
        currentEmployee,
    } = useEmployees();

    const employee = currentEmployee;

    if (!employee) return null;


    /* ==========================================
       EMERGENCY CONTACT
    ========================================== */

    const emergency =
        employee.emergencyContact || {};


    const emergencyContact =
        typeof emergency === "object"
            ? [
                emergency.name,
                emergency.relationship,
                emergency.phone,
            ]
                .filter(Boolean)
                .join(" • ") || "--"
            : emergency || "--";


    /* ==========================================
       ADDRESS
    ========================================== */

    const address =
        typeof employee.address === "object"
            ? [
                employee.address?.street,
                employee.address?.city,
                employee.address?.state,
                employee.address?.pincode,
            ]
                .filter(Boolean)
                .join(", ") || "--"
            : employee.address || "--";


    const personalInfo = [

        {
            icon: <FaUser />,
            label: "Full Name",
            value:
                employee.name || "--",
        },

        {
            icon: <FaEnvelope />,
            label: "Email",
            value:
                employee.email || "--",
        },

        {
            icon: <FaPhone />,
            label: "Phone",
            value:
                employee.phone || "--",
        },

        {
            icon: <FaVenusMars />,
            label: "Gender",
            value:
                employee.gender || "--",
        },

        {
            icon: <FaBirthdayCake />,
            label: "Date of Birth",
            value:
                employee.dateOfBirth ||
                employee.dob ||
                "--",
        },

        {
            icon: <FaMapMarkerAlt />,
            label: "Address",
            value: address,
        },

        {
            icon: <FaPhoneAlt />,
            label: "Emergency Contact",
            value: emergencyContact,
        },

    ];


    return (
        <div className="personal-info-card">

            <div className="card-title">

                <h3>
                    Personal Information
                </h3>

                <p>
                    Your personal contact details.
                </p>

            </div>


            <div className="personal-grid">

                {personalInfo.map(item => (

                    <div
                        key={item.label}
                        className="info-box"
                    >

                        <div className="info-icon">
                            {item.icon}
                        </div>

                        <div className="info-content">

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

export default PersonalInfoCard;