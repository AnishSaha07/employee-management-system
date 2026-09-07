import "./TaskTable.css";

import {
    FaEdit,
    FaTrash,
} from "react-icons/fa";

import { useState } from "react";

import { useTask } from "../../../context/TaskContext";
import { useToast } from "../../../context/ToastContext";

const TaskTable = ({
    tasks = [],
    onEdit,
}) => {

    const { deleteTask } = useTask();

    const { showToast } = useToast();

    const [deletingId, setDeletingId] =
        useState(null);

    // ==========================================
    // DELETE TASK
    // ==========================================

    const handleDelete = async (task) => {

        const taskId =
            task.id || task._id;

        if (!taskId) {

            showToast(
                "error",
                "Delete Failed",
                "Task ID is missing."
            );

            return;
        }

        // Prevent duplicate delete requests
        if (deletingId === taskId) {
            return;
        }

        // Confirmation
        const confirmed = window.confirm(
            `Delete "${task.title}"?`
        );

        if (!confirmed) {
            return;
        }

        try {

            setDeletingId(taskId);

            // ==================================
            // WAIT FOR BACKEND RESPONSE
            // ==================================

            const result =
                await deleteTask(taskId);

            // ==================================
            // SUCCESS
            // ==================================

            if (result?.success) {

                showToast(
                    "success",
                    "Task Deleted",
                    "Task deleted successfully."
                );

            }

            // ==================================
            // BACKEND FAILURE
            // ==================================

            else {

                showToast(
                    "error",
                    "Delete Failed",
                    result?.message ||
                        "Failed to delete task."
                );

            }

        } catch (error) {

            console.error(
                "Delete task error:",
                error
            );

            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Unable to delete task. Please try again.";

            showToast(
                "error",
                "Delete Failed",
                message
            );

        } finally {

            setDeletingId(null);

        }
    };

    return (

        <div className="task-table-card">

            <table className="task-table">

                <thead>

                    <tr>

                        <th>
                            Employee
                        </th>

                        <th>
                            Task
                        </th>

                        <th>
                            Priority
                        </th>

                        <th>
                            Due Date
                        </th>

                        <th>
                            Status
                        </th>

                        <th>
                            Actions
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {tasks.length === 0 ? (

                        <tr>

                            <td
                                className="empty-row"
                                colSpan="6"
                            >
                                No Tasks Found
                            </td>

                        </tr>

                    ) : (

                        tasks.map((task) => {

                            const taskId =
                                task.id ||
                                task._id;

                            const isDeleting =
                                deletingId === taskId;

                            return (

                                <tr
                                    key={taskId}
                                >

                                    {/* =========================
                                            EMPLOYEE
                                    ========================= */}

                                    <td>

                                        <div className="employee-cell">

                                            <h4>
                                                {
                                                    task.employeeName ||
                                                    "--"
                                                }
                                            </h4>

                                            <span>
                                                {
                                                    task.employeeId ||
                                                    "--"
                                                }
                                            </span>

                                        </div>

                                    </td>

                                    {/* =========================
                                            TASK
                                    ========================= */}

                                    <td>

                                        <div className="task-cell">

                                            <strong>
                                                {
                                                    task.title ||
                                                    "--"
                                                }
                                            </strong>

                                            <p>
                                                {
                                                    task.description ||
                                                    "--"
                                                }
                                            </p>

                                        </div>

                                    </td>

                                    {/* =========================
                                            PRIORITY
                                    ========================= */}

                                    <td>

                                        <span
                                            className={`priority ${
                                                (
                                                    task.priority ||
                                                    "Medium"
                                                ).toLowerCase()
                                            }`}
                                        >
                                            {
                                                task.priority ||
                                                "Medium"
                                            }
                                        </span>

                                    </td>

                                    {/* =========================
                                            DUE DATE
                                    ========================= */}

                                    <td>

                                        {
                                            task.dueDate ||
                                            "--"
                                        }

                                    </td>

                                    {/* =========================
                                            STATUS
                                    ========================= */}

                                    <td>

                                        <span
                                            className={`status ${
                                                (
                                                    task.status ||
                                                    "Pending"
                                                )
                                                    .toLowerCase()
                                                    .replace(
                                                        /\s/g,
                                                        "-"
                                                    )
                                            }`}
                                        >
                                            {
                                                task.status ||
                                                "Pending"
                                            }
                                        </span>

                                    </td>

                                    {/* =========================
                                            ACTIONS
                                    ========================= */}

                                    <td>

                                        <div className="task-actions">

                                            {/* EDIT */}

                                            <button
                                                type="button"
                                                className="edit-btn"
                                                onClick={() =>
                                                    onEdit(task)
                                                }
                                                disabled={
                                                    isDeleting
                                                }
                                            >

                                                <FaEdit />

                                            </button>

                                            {/* DELETE */}

                                            <button
                                                type="button"
                                                className="delete-btn"
                                                onClick={() =>
                                                    handleDelete(
                                                        task
                                                    )
                                                }
                                                disabled={
                                                    isDeleting
                                                }
                                                title={
                                                    isDeleting
                                                        ? "Deleting..."
                                                        : "Delete Task"
                                                }
                                            >

                                                <FaTrash />

                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            );
                        })

                    )}

                </tbody>

            </table>

        </div>

    );
};

export default TaskTable;