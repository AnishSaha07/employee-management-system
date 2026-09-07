import { useState } from "react";

import "./AssignTaskModal.css";

import Modal from "../../../common/Modal";

import { useEmployees } from "../../../context/EmployeeContext";
import { useToast } from "../../../context/ToastContext";
import { useTask } from "../../../context/TaskContext";

const INITIAL_STATE = {
    employeeId: "",
    title: "",
    description: "",
    priority: "Medium",
    dueDate: "",
};

const getFormData = (task) => ({
    employeeId: task?.employeeId || "",
    title: task?.title || "",
    description: task?.description || "",
    priority: task?.priority || "Medium",
    dueDate: task?.dueDate
        ? String(task.dueDate).slice(0, 10)
        : "",
});

const AssignTaskModal = ({
    open,
    onClose,
    task = null,
}) => {
    const { employees = [] } = useEmployees();

    const {
        createTask,
        updateTask,
    } = useTask();

    const { showToast } = useToast();

    // Form is initialized directly from the task.
    // No useEffect/setState synchronization is needed.
    const [taskData, setTaskData] = useState(
        () => getFormData(task)
    );

    const [submitting, setSubmitting] = useState(false);

    // ==========================================
    // HANDLE INPUT CHANGE
    // ==========================================

    const handleChange = (e) => {
        const {
            name,
            value,
        } = e.target;

        setTaskData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // ==========================================
    // RESET FORM
    // ==========================================

    const resetForm = () => {
        setTaskData(INITIAL_STATE);
    };

    // ==========================================
    // SUBMIT
    // ==========================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (submitting) {
            return;
        }

        // ======================================
        // BASIC VALIDATION
        // ======================================

        const employeeId =
            taskData.employeeId.trim();

        const title =
            taskData.title.trim();

        const description =
            taskData.description.trim();

        if (!employeeId) {
            showToast(
                "error",
                "Employee Required",
                "Please select an employee."
            );
            return;
        }

        if (!title) {
            showToast(
                "error",
                "Task Title Required",
                "Please enter a task title."
            );
            return;
        }

        if (!description) {
            showToast(
                "error",
                "Description Required",
                "Please enter a task description."
            );
            return;
        }

        if (!taskData.dueDate) {
            showToast(
                "error",
                "Due Date Required",
                "Please select a due date."
            );
            return;
        }

        // ======================================
        // FIND EMPLOYEE
        // ======================================

        const employee = employees.find(
            (emp) =>
                String(emp.employeeId || "")
                    .trim()
                    .toUpperCase() ===
                employeeId.toUpperCase()
        );

        if (!employee) {
            showToast(
                "error",
                "Employee Not Found",
                "Please select a valid employee."
            );
            return;
        }

        // ======================================
        // BACKEND PAYLOAD
        // ======================================
        // employeeName, assignedBy and status are
        // intentionally NOT sent here.
        // Backend handles those values.

        const taskPayload = {
            employeeId:
                employee.employeeId,

            title,

            description,

            priority:
                taskData.priority || "Medium",

            dueDate:
                taskData.dueDate,
        };

        try {
            setSubmitting(true);

            let result;

            // ==================================
            // UPDATE EXISTING TASK
            // ==================================

            if (task) {
                const taskId =
                    task.id || task._id;

                if (!taskId) {
                    showToast(
                        "error",
                        "Invalid Task",
                        "Task ID is missing."
                    );

                    return;
                }

                result = await updateTask(
                    taskId,
                    taskPayload
                );

                if (result?.success) {
                    showToast(
                        "success",
                        "Task Updated",
                        "Task updated successfully."
                    );

                    resetForm();
                    onClose();
                } else {
                    showToast(
                        "error",
                        "Update Failed",
                        result?.message ||
                            "Failed to update task."
                    );
                }

                return;
            }

            // ==================================
            // CREATE NEW TASK
            // ==================================

            result = await createTask(
                taskPayload
            );

            if (result?.success) {
                showToast(
                    "success",
                    "Task Assigned",
                    `Task assigned to ${
                        employee.name || employee.employeeId
                    }.`
                );

                resetForm();
                onClose();
            } else {
                showToast(
                    "error",
                    "Assignment Failed",
                    result?.message ||
                        "Failed to assign task."
                );
            }
        } catch (error) {
            console.error(
                "Task submission error:",
                error
            );

            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Unable to save the task. Please try again.";

            showToast(
                "error",
                "Something Went Wrong",
                message
            );
        } finally {
            setSubmitting(false);
        }
    };

    // ==========================================
    // RENDER
    // ==========================================

    return (
        <Modal
            open={open}
            title={
                task
                    ? "Edit Task"
                    : "Assign Task"
            }
            onClose={
                submitting
                    ? undefined
                    : onClose
            }
        >
            <form
                className="task-form"
                onSubmit={handleSubmit}
            >
                {/* =========================
                        EMPLOYEE
                ========================= */}

                <div className="task-group">
                    <label>
                        Employee
                    </label>

                    <select
                        name="employeeId"
                        value={
                            taskData.employeeId
                        }
                        onChange={
                            handleChange
                        }
                        required
                        disabled={
                            submitting
                        }
                    >
                        <option value="">
                            Select Employee
                        </option>

                        {employees
                            .filter(
                                (emp) =>
                                    emp.role ===
                                    "employee"
                            )
                            .map((emp) => (
                                <option
                                    key={
                                        emp.id ||
                                        emp._id ||
                                        emp.employeeId
                                    }
                                    value={
                                        emp.employeeId
                                    }
                                >
                                    {
                                        emp.employeeId
                                    }{" "}
                                    •{" "}
                                    {
                                        emp.name
                                    }
                                </option>
                            ))}
                    </select>
                </div>

                {/* =========================
                        TASK TITLE
                ========================= */}

                <div className="task-group">
                    <label>
                        Task Title
                    </label>

                    <input
                        type="text"
                        name="title"
                        placeholder="Task title"
                        value={
                            taskData.title
                        }
                        onChange={
                            handleChange
                        }
                        required
                        disabled={
                            submitting
                        }
                    />
                </div>

                {/* =========================
                        DESCRIPTION
                ========================= */}

                <div className="task-group">
                    <label>
                        Description
                    </label>

                    <textarea
                        rows="4"
                        name="description"
                        placeholder="Task description"
                        value={
                            taskData.description
                        }
                        onChange={
                            handleChange
                        }
                        required
                        disabled={
                            submitting
                        }
                    />
                </div>

                {/* =========================
                    PRIORITY + DUE DATE
                ========================= */}

                <div className="task-row">

                    <div className="task-group">
                        <label>
                            Priority
                        </label>

                        <select
                            name="priority"
                            value={
                                taskData.priority
                            }
                            onChange={
                                handleChange
                            }
                            disabled={
                                submitting
                            }
                        >
                            <option value="Low">
                                Low
                            </option>

                            <option value="Medium">
                                Medium
                            </option>

                            <option value="High">
                                High
                            </option>
                        </select>
                    </div>

                    <div className="task-group">
                        <label>
                            Due Date
                        </label>

                        <input
                            type="date"
                            name="dueDate"
                            value={
                                taskData.dueDate
                            }
                            onChange={
                                handleChange
                            }
                            required
                            disabled={
                                submitting
                            }
                        />
                    </div>

                </div>

                {/* =========================
                        BUTTONS
                ========================= */}

                <div className="task-buttons">

                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={
                            onClose
                        }
                        disabled={
                            submitting
                        }
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="create-btn"
                        disabled={
                            submitting
                        }
                    >
                        {submitting
                            ? task
                                ? "Updating..."
                                : "Assigning..."
                            : task
                                ? "Update Task"
                                : "Assign Task"}
                    </button>

                </div>
            </form>
        </Modal>
    );
};

export default AssignTaskModal;