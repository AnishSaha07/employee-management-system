import "./ProfileCard.css";

import {
    FaCamera,
    FaPen,
    FaCircle,
} from "react-icons/fa";

import { useState } from "react";

import { useEmployees } from "../../../context/EmployeeContext";

import EditProfileModal from "../Modals/EditProfileModal";


const ProfileCard = () => {

    const {
        currentEmployee,
        loading,
    } = useEmployees();


    const [open, setOpen] =
        useState(false);


    if (loading) {
        return null;
    }


    if (!currentEmployee) {
        return null;
    }


    const employee =
        currentEmployee;


    const initials =
        employee.name
            ? employee.name
                .split(" ")
                .filter(Boolean)
                .map(
                    word => word[0]
                )
                .join("")
                .toUpperCase()
            : "E";


    return (

        <>

            <div className="profile-card">

                <div className="profile-banner"></div>


                <div className="profile-avatar-wrapper">

                    {employee.profileImage ? (

                        <img
                            src={
                                employee.profileImage
                            }
                            alt={
                                employee.name ||
                                "Employee"
                            }
                            className="profile-avatar"
                        />

                    ) : (

                        <div className="profile-avatar">

                            {initials}

                        </div>
                    )}


                    <button
                        type="button"
                        className="camera-btn"
                    >

                        <FaCamera />

                    </button>

                </div>


                <div className="profile-content">

                    <h2>
                        {employee.name}
                    </h2>


                    <p>
                        {employee.designation ||
                            "Employee"}
                    </p>


                    <span>
                        {employee.department ||
                            "—"}
                    </span>


                    <div className="employee-id">

                        Employee ID

                        <strong>
                            {employee.employeeId}
                        </strong>

                    </div>


                    <div className="employee-status">

                        <FaCircle />

                        {employee.status ||
                            "Active"}

                    </div>


                    <button
                        type="button"
                        className="edit-profile-btn"
                        onClick={() =>
                            setOpen(true)
                        }
                    >

                        <FaPen />

                        Edit Profile

                    </button>

                </div>

            </div>


            <EditProfileModal

                open={open}

                onClose={() =>
                    setOpen(false)
                }

                employee={employee}

            />

        </>
    );
};


export default ProfileCard;