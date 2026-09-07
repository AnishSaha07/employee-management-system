/* eslint-disable react-refresh/only-export-components */
import {
    createContext,
    useCallback,
    useContext,
    useState,
} from "react";

import api from "../services/api";

const TaskContext = createContext();

const normalizeTask = (task) => ({
    ...task,

    // MongoDB _id → existing frontend id
    id: task._id || task.id,

    employeeId:
        task.employeeId ||
        task.employee?.employeeId ||
        "",

    employeeName:
        task.employeeName ||
        task.employee?.name ||
        "",

    title: task.title || "",
    description: task.description || "",

    priority: task.priority || "Medium",

    dueDate: task.dueDate
        ? String(task.dueDate).slice(0, 10)
        : "",

    status: task.status || "Pending",

    assignedBy: task.assignedBy || "Admin",

    createdAt: task.createdAt || "",
    updatedAt: task.updatedAt || "",
});

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // ==========================================
    // ADMIN - FETCH ALL TASKS
    // ==========================================
    const fetchAllTasks = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/tasks");

            const data = response.data?.tasks || response.data || [];

            setTasks(data.map(normalizeTask));

            return {
                success: true,
                tasks: data,
            };
        } catch (err) {
            console.error("Fetch all tasks error:", err);

            const message =
                err.response?.data?.message ||
                "Failed to fetch tasks";

            setError(message);

            return {
                success: false,
                message,
            };
        } finally {
            setLoading(false);
        }
    }, []);

    // ==========================================
    // EMPLOYEE - FETCH MY TASKS
    // ==========================================
    const fetchMyTasks = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/tasks/my");

            const data = response.data?.tasks || response.data || [];

            setTasks(data.map(normalizeTask));

            return {
                success: true,
                tasks: data,
            };
        } catch (err) {
            console.error("Fetch my tasks error:", err);

            const message =
                err.response?.data?.message ||
                "Failed to fetch your tasks";

            setError(message);

            return {
                success: false,
                message,
            };
        } finally {
            setLoading(false);
        }
    }, []);

    // ==========================================
    // CREATE TASK - ADMIN
    // ==========================================
    const createTask = async (task) => {
        try {
            setError("");

            const payload = {
                employeeId: task.employeeId,
                title: task.title,
                description: task.description,
                priority: task.priority,
                dueDate: task.dueDate,
            };

            const response = await api.post("/tasks", payload);

            const newTask = normalizeTask(
                response.data?.task || response.data
            );

            setTasks((prev) => [newTask, ...prev]);

            return {
                success: true,
                task: newTask,
            };
        } catch (err) {
            console.error("Create task error:", err);

            const message =
                err.response?.data?.message ||
                "Failed to create task";

            setError(message);

            return {
                success: false,
                message,
            };
        }
    };

    // ==========================================
    // UPDATE TASK - ADMIN
    // ==========================================
    const updateTask = async (taskOrId, taskData = {}) => {
        try {
            setError("");

            const taskId =
                typeof taskOrId === "object"
                    ? taskOrId.id || taskOrId._id
                    : taskOrId;

            const existingTask =
                typeof taskOrId === "object"
                    ? taskOrId
                    : tasks.find((task) => task.id === taskId);

            const payload = {
                employeeId:
                    taskData.employeeId ??
                    existingTask?.employeeId,

                title:
                    taskData.title ??
                    existingTask?.title,

                description:
                    taskData.description ??
                    existingTask?.description,

                priority:
                    taskData.priority ??
                    existingTask?.priority,

                dueDate:
                    taskData.dueDate ??
                    existingTask?.dueDate,
            };

            const response = await api.put(
                `/tasks/${taskId}`,
                payload
            );

            const updatedTask = normalizeTask(
                response.data?.task || response.data
            );

            setTasks((prev) =>
                prev.map((task) =>
                    task.id === taskId
                        ? updatedTask
                        : task
                )
            );

            return {
                success: true,
                task: updatedTask,
            };
        } catch (err) {
            console.error("Update task error:", err);

            const message =
                err.response?.data?.message ||
                "Failed to update task";

            setError(message);

            return {
                success: false,
                message,
            };
        }
    };

    // ==========================================
    // DELETE TASK - ADMIN
    // ==========================================
    const deleteTask = async (id) => {
        try {
            setError("");

            await api.delete(`/tasks/${id}`);

            setTasks((prev) =>
                prev.filter((task) => task.id !== id)
            );

            return {
                success: true,
            };
        } catch (err) {
            console.error("Delete task error:", err);

            const message =
                err.response?.data?.message ||
                "Failed to delete task";

            setError(message);

            return {
                success: false,
                message,
            };
        }
    };

    // ==========================================
    // UPDATE TASK STATUS - EMPLOYEE
    // ==========================================
    const updateTaskStatus = async (id, status) => {
        try {
            setError("");

            const response = await api.put(
                `/tasks/${id}/status`,
                { status }
            );

            const updatedTask = normalizeTask(
                response.data?.task || response.data
            );

            setTasks((prev) =>
                prev.map((task) =>
                    task.id === id
                        ? updatedTask
                        : task
                )
            );

            return {
                success: true,
                task: updatedTask,
            };
        } catch (err) {
            console.error("Update task status error:", err);

            const message =
                err.response?.data?.message ||
                "Failed to update task status";

            setError(message);

            return {
                success: false,
                message,
            };
        }
    };

    // ==========================================
    // GET EMPLOYEE TASKS FROM CURRENT STATE
    // ==========================================
    const getEmployeeTasks = (employeeId) => {
        return tasks.filter(
            (task) => task.employeeId === employeeId
        );
    };

    return (
        <TaskContext.Provider
            value={{
                tasks,
                loading,
                error,

                fetchAllTasks,
                fetchMyTasks,

                createTask,
                updateTask,
                deleteTask,
                updateTaskStatus,

                getEmployeeTasks,
            }}
        >
            {children}
        </TaskContext.Provider>
    );
};

export const useTask = () => useContext(TaskContext);