import { useState } from "react";

import "./EditProfileModal.css";

import Modal from "../../../common/Modal";

import { useEmployees } from "../../../context/EmployeeContext";

import { useToast } from "../../../context/ToastContext";


/* ==========================================
   FORM DATA BUILDER
========================================== */

const getFormData = (employee) => {

    const emergencyContact =
        employee?.emergencyContact;


    return {

        phone:
            employee?.phone || "",

        gender:
            employee?.gender || "",

        dob:
            employee?.dob
                ? String(employee.dob).slice(0, 10)
                : employee?.dateOfBirth
                    ? String(employee.dateOfBirth).slice(0, 10)
                    : "",

        address:
            typeof employee?.address === "string"
                ? employee.address
                : employee?.address?.address ||
                  employee?.address?.fullAddress ||
                  "",

        emergencyName:
            typeof emergencyContact === "object"
                ? emergencyContact?.name || ""
                : emergencyContact || "",

        emergencyRelationship:
            typeof emergencyContact === "object"
                ? emergencyContact?.relationship || ""
                : "",

        emergencyPhone:
            typeof emergencyContact === "object"
                ? emergencyContact?.phone || ""
                : "",

        profileImage:
            employee?.profileImage || "",

        bankName:
            employee?.bankDetails?.bankName || "",

        accountHolder:
            employee?.bankDetails?.accountHolder || "",

        accountNumber:
            employee?.bankDetails?.accountNumber || "",

        confirmAccountNumber:
            employee?.bankDetails?.accountNumber || "",

        ifsc:
            employee?.bankDetails?.ifsc || "",

        branch:
            employee?.bankDetails?.branch || "",

        upiId:
            employee?.bankDetails?.upiId || "",
    };
};


/* ==========================================
   COMPONENT
========================================== */

const EditProfileModal = ({
    open,
    onClose,
    employee,
}) => {

    const {
        updateMyProfile,
    } = useEmployees();


    const {
        showToast,
    } = useToast();


    const [formData, setFormData] =
        useState(() => getFormData(employee));


    const [saving, setSaving] =
        useState(false);


    /* ==========================================
       HANDLE INPUT
    ========================================== */

    const handleChange = (e) => {

        const {
            name,
            value,
        } = e.target;


        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };


    /* ==========================================
       HANDLE PROFILE IMAGE
    ========================================== */

    const handleImage = (e) => {

        const file =
            e.target.files?.[0];


        if (!file) {
            return;
        }


        /* ======================================
           BASIC IMAGE SIZE CHECK
        ====================================== */

        if (file.size > 2 * 1024 * 1024) {

            showToast(
                "error",
                "Image Too Large",
                "Please select an image smaller than 2 MB."
            );

            e.target.value = "";

            return;
        }


        const reader =
            new FileReader();


        reader.onloadend = () => {

            setFormData(prev => ({
                ...prev,
                profileImage:
                    reader.result,
            }));

        };


        reader.readAsDataURL(file);
    };


    /* ==========================================
       SUBMIT
    ========================================== */

    const handleSubmit = async (e) => {

        e.preventDefault();


        if (!employee) {

            showToast(
                "error",
                "Update Failed",
                "Employee information is unavailable."
            );

            return;
        }


        /* ======================================
           ACCOUNT NUMBER VALIDATION
        ====================================== */

        if (
            formData.accountNumber !==
            formData.confirmAccountNumber
        ) {

            showToast(
                "error",
                "Validation Error",
                "Account numbers do not match."
            );

            return;
        }


        try {

            setSaving(true);


            /* ==================================
               EMPLOYEE SELF-PROFILE PAYLOAD
            ================================== */

            const updateData = {

                phone:
                    formData.phone,

                gender:
                    formData.gender,

                dob:
                    formData.dob,

                address:
                    formData.address,

                emergencyContact: {

                    name:
                        formData.emergencyName,

                    relationship:
                        formData.emergencyRelationship,

                    phone:
                        formData.emergencyPhone,
                },

                profileImage:
                    formData.profileImage,

                bankDetails: {

                    bankName:
                        formData.bankName,

                    accountHolder:
                        formData.accountHolder,

                    accountNumber:
                        formData.accountNumber,

                    ifsc:
                        formData.ifsc,

                    branch:
                        formData.branch,

                    upiId:
                        formData.upiId,
                },
            };


            /* ==================================
               CALL EMPLOYEE SELF-PROFILE API
            ================================== */

            await updateMyProfile(
                updateData
            );


            showToast(
                "success",
                "Profile Updated",
                "Your profile has been updated successfully."
            );


            onClose();

        } catch (error) {

            console.error(
                "Profile update error:",
                error
            );


            showToast(
                "error",
                "Update Failed",
                error.response?.data?.message ||
                error.message ||
                "Failed to update your profile."
            );

        } finally {

            setSaving(false);
        }
    };


    /* ==========================================
       RENDER
    ========================================== */

    return (

        <Modal
            open={open}
            title="Edit Profile"
            onClose={onClose}
        >

            <form
                className="edit-profile-form"
                onSubmit={handleSubmit}
            >

                {/* ==================================
                    PROFILE IMAGE
                ================================== */}

                <div className="profile-upload">

                    {formData.profileImage ? (

                        <img
                            src={
                                formData.profileImage
                            }
                            alt="Profile"
                        />

                    ) : (

                        <div className="avatar-placeholder">
                            Upload
                        </div>

                    )}

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImage}
                    />

                </div>


                {/* ==================================
                    PERSONAL INFORMATION
                ================================== */}

                <div className="section-title">
                    Personal Information
                </div>


                <div className="form-grid">

                    <input
                        name="phone"
                        placeholder="Phone"
                        value={
                            formData.phone
                        }
                        onChange={
                            handleChange
                        }
                    />


                    <select
                        name="gender"
                        value={
                            formData.gender
                        }
                        onChange={
                            handleChange
                        }
                    >

                        <option value="">
                            Select Gender
                        </option>

                        <option value="Male">
                            Male
                        </option>

                        <option value="Female">
                            Female
                        </option>

                        <option value="Other">
                            Other
                        </option>

                    </select>


                    <input
                        type="date"
                        name="dob"
                        value={
                            formData.dob
                        }
                        onChange={
                            handleChange
                        }
                    />


                    <input
                        name="emergencyName"
                        placeholder="Emergency Contact Name"
                        value={
                            formData.emergencyName
                        }
                        onChange={
                            handleChange
                        }
                    />


                    <input
                        name="emergencyRelationship"
                        placeholder="Relationship"
                        value={
                            formData.emergencyRelationship
                        }
                        onChange={
                            handleChange
                        }
                    />


                    <input
                        name="emergencyPhone"
                        placeholder="Emergency Contact Phone"
                        value={
                            formData.emergencyPhone
                        }
                        onChange={
                            handleChange
                        }
                    />

                </div>


                <textarea
                    name="address"
                    placeholder="Address"
                    value={
                        formData.address
                    }
                    onChange={
                        handleChange
                    }
                />


                {/* ==================================
                    BANK DETAILS
                ================================== */}

                <div className="section-title">
                    Bank Details
                </div>


                <div className="form-grid">

                    <input
                        name="bankName"
                        placeholder="Bank Name"
                        value={
                            formData.bankName
                        }
                        onChange={
                            handleChange
                        }
                    />


                    <input
                        name="accountHolder"
                        placeholder="Account Holder"
                        value={
                            formData.accountHolder
                        }
                        onChange={
                            handleChange
                        }
                    />


                    <input
                        name="accountNumber"
                        placeholder="Account Number"
                        value={
                            formData.accountNumber
                        }
                        onChange={
                            handleChange
                        }
                    />


                    <input
                        name="confirmAccountNumber"
                        placeholder="Confirm Account Number"
                        value={
                            formData.confirmAccountNumber
                        }
                        onChange={
                            handleChange
                        }
                    />


                    <input
                        name="ifsc"
                        placeholder="IFSC Code"
                        value={
                            formData.ifsc
                        }
                        onChange={
                            handleChange
                        }
                    />


                    <input
                        name="branch"
                        placeholder="Branch"
                        value={
                            formData.branch
                        }
                        onChange={
                            handleChange
                        }
                    />

                </div>


                <input
                    name="upiId"
                    placeholder="UPI ID (Optional)"
                    value={
                        formData.upiId
                    }
                    onChange={
                        handleChange
                    }
                />


                {/* ==================================
                    ACTIONS
                ================================== */}

                <div className="modal-actions">

                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={onClose}
                        disabled={saving}
                    >
                        Cancel
                    </button>


                    <button
                        type="submit"
                        className="save-btn"
                        disabled={saving}
                    >

                        {saving
                            ? "Saving..."
                            : "Save Changes"}

                    </button>

                </div>

            </form>

        </Modal>
    );
};


export default EditProfileModal;