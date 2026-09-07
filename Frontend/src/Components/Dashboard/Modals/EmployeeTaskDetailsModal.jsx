import { useState } from "react";
import "./EmployeeTaskDetailsModal.css";

import Modal from "../../../common/Modal";

import { useTask } from "../../../context/TaskContext";
import { useToast } from "../../../context/ToastContext";

const EmployeeTaskDetailsModal = ({
    open,
    task,
    onClose,
}) => {

    const { updateTaskStatus } = useTask();

    const { showToast } = useToast();

    const [status, setStatus] =
        useState(task?.status || "Pending");

    const [saving, setSaving] =
        useState(false);

    if (!task) return null;

    const taskId =
        task.id ||
        task._id;

    const currentStatus =
        task.status ||
        "Pending";

    // ==========================================
    // ALLOWED STATUS FLOW
    // Pending → In Progress → Completed
    // ==========================================

    const statusOptions = {

        Pending: [
            "Pending",
            "In Progress",
        ],

        "In Progress": [
            "In Progress",
            "Completed",
        ],

        Completed: [
            "Completed",
        ],

    };

    const allowedStatuses =
        statusOptions[currentStatus] ||
        [currentStatus];

    // ==========================================
    // SAVE STATUS
    // ==========================================

    const handleSave = async () => {

        if (saving) return;

        if (!taskId) {

            showToast(
                "error",
                "Update Failed",
                "Task ID is missing."
            );

            return;
        }

        // Prevent invalid status transition
        if (!allowedStatuses.includes(status)) {

            showToast(
                "error",
                "Invalid Status",
                "Task status can only move from Pending to In Progress to Completed."
            );

            return;
        }

        // Nothing changed
        if (status === currentStatus) {

            onClose();

            return;
        }

        try {

            setSaving(true);

            // ==================================
            // WAIT FOR BACKEND RESPONSE
            // ==================================

            const result =
                await updateTaskStatus(
                    taskId,
                    status
                );

            // ==================================
            // BACKEND SUCCESS
            // ==================================

            if (result?.success) {

                showToast(
                    "success",
                    "Task Updated",
                    "Task status updated successfully."
                );

                onClose();

            }

            // ==================================
            // BACKEND FAILURE
            // ==================================

            else {

                showToast(
                    "error",
                    "Update Failed",
                    result?.message ||
                        "Failed to update task status."
                );

            }

        } catch (error) {

            console.error(
                "Update task status error:",
                error
            );

            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Unable to update task status. Please try again.";

            showToast(
                "error",
                "Update Failed",
                message
            );

        } finally {

            setSaving(false);

        }
    };

    return (

        <Modal
            open={open}
            title="Task Details"
            onClose={saving ? undefined : onClose}
        >

            <div className="task-details">

                {/* TITLE */}

                <div className="detail">

                    <label>Title</label>

                    <p>
                        {task.title || "--"}
                    </p>

                </div>

                {/* DESCRIPTION */}

                <div className="detail">

                    <label>Description</label>

                    <p>
                        {task.description || "--"}
                    </p>

                </div>

                {/* PRIORITY */}

                <div className="detail">

                    <label>Priority</label>

                    <p>
                        {task.priority || "Medium"}
                    </p>

                </div>

                {/* DUE DATE */}

                <div className="detail">

                    <label>Due Date</label>

                    <p>
                        {task.dueDate || "--"}
                    </p>

                </div>

                {/* ASSIGNED BY */}

                <div className="detail">

                    <label>Assigned By</label>

                    <p>

                        {
                            typeof task.assignedBy === "object"
                                ? task.assignedBy?.name ||
                                  task.assignedBy?.employeeId ||
                                  "Admin"
                                : task.assignedBy ||
                                  "Admin"
                        }

                    </p>

                </div>

                {/* CREATED AT */}

                <div className="detail">

                    <label>Created At</label>

                    <p>
                        {task.createdAt || "--"}
                    </p>

                </div>

                {/* LAST UPDATED */}

                <div className="detail">

                    <label>Last Updated</label>

                    <p>
                        {task.updatedAt || "--"}
                    </p>

                </div>

                {/* STATUS */}

                <div className="detail">

                    <label>Status</label>

                    <select
                        value={status}
                        disabled={
                            saving ||
                            currentStatus === "Completed"
                        }
                        onChange={(e) =>
                            setStatus(e.target.value)
                        }
                    >

                        {allowedStatuses.map(
                            (option) => (

                                <option
                                    key={option}
                                    value={option}
                                >
                                    {option}
                                </option>

                            )
                        )}

                    </select>

                </div>

                {/* SAVE */}

                <button
                    type="button"
                    className="save-btn"
                    onClick={handleSave}
                    disabled={
                        saving ||
                        currentStatus === "Completed"
                    }
                >

                    {saving
                        ? "Saving..."
                        : "Save Changes"}

                </button>

            </div>

        </Modal>

    );

};

export default EmployeeTaskDetailsModal;