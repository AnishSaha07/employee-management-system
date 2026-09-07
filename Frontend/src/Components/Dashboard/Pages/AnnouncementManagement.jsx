import { useState } from "react";

import "./AnnouncementManagement.css";

import {
    FaBullhorn,
    FaPlus,
    FaTrash,
    FaToggleOn,
    FaToggleOff,
    FaEdit,
    FaTimes,
} from "react-icons/fa";

import { useAnnouncement } from "../../../context/AnnouncementContext";
import { useToast } from "../../../context/ToastContext";


const INITIAL_FORM = {

    title: "",

    description: "",

    type: "General",

    priority: "Normal",

};


const AnnouncementManagement = () => {

    const {
        announcements,
        createAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        toggleAnnouncement,
    } = useAnnouncement();


    const { showToast } = useToast();


    const [showForm, setShowForm] =
        useState(false);


    const [editingId, setEditingId] =
        useState(null);


    const [formData, setFormData] =
        useState(INITIAL_FORM);


    /* ===========================
            HANDLE CHANGE
    =========================== */

    const handleChange = (e) => {

        const {
            name,
            value,
        } = e.target;


        setFormData((prev) => ({

            ...prev,

            [name]: value,

        }));

    };


    /* ===========================
            OPEN CREATE
    =========================== */

    const handleCreate = () => {

        setEditingId(null);

        setFormData(INITIAL_FORM);

        setShowForm(true);

    };


    /* ===========================
            OPEN EDIT
    =========================== */

    const handleEdit = (announcement) => {

        setEditingId(announcement.id);

        setFormData({

            title: announcement.title || "",

            description:
                announcement.description || "",

            type:
                announcement.type || "General",

            priority:
                announcement.priority || "Normal",

        });

        setShowForm(true);

    };


    /* ===========================
            CLOSE FORM
    =========================== */

    const handleCloseForm = () => {

        setShowForm(false);

        setEditingId(null);

        setFormData(INITIAL_FORM);

    };


    /* ===========================
            SUBMIT
    =========================== */

    const handleSubmit = (e) => {

        e.preventDefault();


        if (
            !formData.title.trim() ||
            !formData.description.trim()
        ) {

            showToast(
                "error",
                "Missing Information",
                "Please enter a title and announcement message."
            );

            return;

        }


        /* ===========================
                EDIT
        =========================== */

        if (editingId) {

            const existing =
                announcements.find(
                    item =>
                        item.id === editingId
                );


            updateAnnouncement({

                ...existing,

                ...formData,

            });


            showToast(
                "success",
                "Announcement Updated",
                "The announcement has been updated successfully."
            );

        }

        /* ===========================
                CREATE
        =========================== */

        else {

            createAnnouncement(
                formData
            );


            showToast(
                "success",
                "Announcement Published",
                "The announcement is now available to employees."
            );

        }


        handleCloseForm();

    };


    /* ===========================
            DELETE
    =========================== */

    const handleDelete = (id) => {

        deleteAnnouncement(id);


        showToast(
            "success",
            "Announcement Deleted",
            "The announcement has been removed."
        );

    };


    /* ===========================
            TOGGLE
    =========================== */

    const handleToggle = (id, active) => {

        toggleAnnouncement(id);


        showToast(

            "success",

            active
                ? "Announcement Hidden"
                : "Announcement Published",

            active
                ? "The announcement is hidden from employees."
                : "The announcement is visible to employees."

        );

    };


    return (

        <section className="announcement-management">


            {/* ===========================
                    HEADER
            =========================== */}

            <div className="announcement-management-header">

                <div className="announcement-title">

                    <div className="announcement-main-icon">

                        <FaBullhorn />

                    </div>

                    <div>

                        <h3>
                            Employee Announcements
                        </h3>

                        <p>
                            Publish announcements that appear on the employee dashboard.
                        </p>

                    </div>

                </div>


                <button
                    type="button"
                    className="announcement-add-btn"
                    onClick={handleCreate}
                >

                    <FaPlus />

                    New Announcement

                </button>

            </div>


            {/* ===========================
                    FORM
            =========================== */}

            {showForm && (

                <div className="announcement-form-card">

                    <div className="announcement-form-header">

                        <div>

                            <h3>

                                {editingId
                                    ? "Edit Announcement"
                                    : "Create Announcement"
                                }

                            </h3>

                            <p>

                                {editingId
                                    ? "Update the announcement details."
                                    : "Create an announcement for employees."
                                }

                            </p>

                        </div>


                        <button
                            type="button"
                            className="announcement-close-btn"
                            onClick={handleCloseForm}
                        >

                            <FaTimes />

                        </button>

                    </div>


                    <form
                        onSubmit={handleSubmit}
                        className="announcement-form"
                    >


                        {/* TITLE */}

                        <div className="announcement-form-group">

                            <label>
                                Title
                            </label>

                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Enter announcement title"
                                required
                            />

                        </div>


                        {/* ROW */}

                        <div className="announcement-form-row">


                            {/* TYPE */}

                            <div className="announcement-form-group">

                                <label>
                                    Type
                                </label>

                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                >

                                    <option value="General">
                                        General
                                    </option>

                                    <option value="Holiday">
                                        Holiday
                                    </option>

                                    <option value="Important">
                                        Important
                                    </option>

                                    <option value="Event">
                                        Event
                                    </option>

                                </select>

                            </div>


                            {/* PRIORITY */}

                            <div className="announcement-form-group">

                                <label>
                                    Priority
                                </label>

                                <select
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                >

                                    <option value="Normal">
                                        Normal
                                    </option>

                                    <option value="High">
                                        High
                                    </option>

                                    <option value="Urgent">
                                        Urgent
                                    </option>

                                </select>

                            </div>

                        </div>


                        {/* DESCRIPTION */}

                        <div className="announcement-form-group">

                            <label>
                                Announcement
                            </label>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Write the announcement employees should see..."
                                rows="5"
                                required
                            />

                        </div>


                        {/* ACTIONS */}

                        <div className="announcement-form-actions">

                            <button
                                type="button"
                                className="announcement-cancel-btn"
                                onClick={handleCloseForm}
                            >

                                Cancel

                            </button>


                            <button
                                type="submit"
                                className="announcement-save-btn"
                            >

                                <FaBullhorn />

                                {editingId
                                    ? "Update Announcement"
                                    : "Publish Announcement"
                                }

                            </button>

                        </div>

                    </form>

                </div>

            )}


            {/* ===========================
                    ANNOUNCEMENT LIST
            =========================== */}

            <div className="announcement-list">


                {announcements.length === 0 ? (

                    <div className="announcement-empty">

                        <FaBullhorn />

                        <h4>
                            No Announcements
                        </h4>

                        <p>
                            Create your first announcement for employees.
                        </p>

                        <button
                            type="button"
                            onClick={handleCreate}
                        >

                            <FaPlus />

                            Create Announcement

                        </button>

                    </div>

                ) : (

                    announcements.map((item) => (

                        <article
                            key={item.id}
                            className={
                                `announcement-item ${
                                    item.active
                                        ? ""
                                        : "inactive"
                                }`
                            }
                        >

                            <div className="announcement-item-content">


                                {/* META */}

                                <div className="announcement-meta">

                                    <span className="announcement-type">

                                        {item.type}

                                    </span>

                                    <span
                                        className={
                                            `announcement-priority ${String(
                                                item.priority
                                            ).toLowerCase()}`
                                        }
                                    >

                                        {item.priority}

                                    </span>

                                    <small>

                                        {item.createdAt}

                                    </small>

                                </div>


                                {/* TITLE */}

                                <h4>
                                    {item.title}
                                </h4>


                                {/* DESCRIPTION */}

                                <p>
                                    {item.description}
                                </p>


                                {/* STATUS */}

                                <div className="announcement-status">

                                    <span
                                        className={
                                            item.active
                                                ? "active-status"
                                                : "inactive-status"
                                        }
                                    >

                                        {item.active
                                            ? "Visible to employees"
                                            : "Hidden from employees"
                                        }

                                    </span>

                                </div>

                            </div>


                            {/* ACTIONS */}

                            <div className="announcement-item-actions">


                                {/* EDIT */}

                                <button
                                    type="button"
                                    className="announcement-edit-btn"
                                    title="Edit announcement"
                                    onClick={() =>
                                        handleEdit(item)
                                    }
                                >

                                    <FaEdit />

                                </button>


                                {/* TOGGLE */}

                                <button
                                    type="button"
                                    className="announcement-toggle-btn"
                                    title={
                                        item.active
                                            ? "Hide from employees"
                                            : "Publish to employees"
                                    }
                                    onClick={() =>
                                        handleToggle(
                                            item.id,
                                            item.active
                                        )
                                    }
                                >

                                    {item.active
                                        ? <FaToggleOn />
                                        : <FaToggleOff />
                                    }

                                </button>


                                {/* DELETE */}

                                <button
                                    type="button"
                                    className="announcement-delete-btn"
                                    title="Delete announcement"
                                    onClick={() =>
                                        handleDelete(
                                            item.id
                                        )
                                    }
                                >

                                    <FaTrash />

                                </button>

                            </div>

                        </article>

                    ))

                )}

            </div>

        </section>

    );

};


export default AnnouncementManagement;