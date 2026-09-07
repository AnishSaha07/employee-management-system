import { useEffect, useMemo, useState } from "react";
import "./TaskManagement.css";

import { useTask } from "../../../context/TaskContext";

import AssignTaskModal from "../Modals/AssignTaskModal";
import TaskTable from "./TaskTable";

const TaskManagement = () => {

    const {
        tasks,
        fetchAllTasks,
        loading,
        error,
    } = useTask();

    const [search, setSearch] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");

    const [showModal, setShowModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    // ==========================================
    // FETCH ALL TASKS FROM BACKEND
    // ==========================================
    useEffect(() => {
        fetchAllTasks();
    }, [fetchAllTasks]);

    // ==========================================
    // FILTER TASKS
    // ==========================================
    const filteredTasks = useMemo(() => {

        return tasks.filter((task) => {

            const title = task.title || "";
            const employeeName = task.employeeName || "";

            const matchesSearch =
                title
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                employeeName
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const matchesPriority =
                priorityFilter === "All" ||
                task.priority === priorityFilter;

            const matchesStatus =
                statusFilter === "All" ||
                task.status === statusFilter;

            return (
                matchesSearch &&
                matchesPriority &&
                matchesStatus
            );
        });

    }, [
        tasks,
        search,
        priorityFilter,
        statusFilter,
    ]);

    // ==========================================
    // SUMMARY COUNTS
    // ==========================================
    const pendingCount = tasks.filter(
        task => task.status === "Pending"
    ).length;

    const progressCount = tasks.filter(
        task => task.status === "In Progress"
    ).length;

    const completedCount = tasks.filter(
        task => task.status === "Completed"
    ).length;

    // ==========================================
    // OPEN CREATE MODAL
    // ==========================================
    const handleCreateTask = () => {
        setSelectedTask(null);
        setShowModal(true);
    };

    // ==========================================
    // OPEN EDIT MODAL
    // ==========================================
    const handleEditTask = (task) => {
        setSelectedTask(task);
        setShowModal(true);
    };

    // ==========================================
    // CLOSE MODAL
    // ==========================================
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedTask(null);
    };

    return (

        <section className="task-management">

            <div className="task-header">

                <div>

                    <h2>Task Management</h2>

                    <p>
                        Create, assign and manage employee tasks.
                    </p>

                </div>

                <button
                    className="primary-btn"
                    onClick={handleCreateTask}
                >
                    + Assign Task
                </button>

            </div>

            <div className="task-summary">

                <div className="summary-card">
                    <h4>Pending</h4>
                    <h2>{pendingCount}</h2>
                </div>

                <div className="summary-card">
                    <h4>In Progress</h4>
                    <h2>{progressCount}</h2>
                </div>

                <div className="summary-card">
                    <h4>Completed</h4>
                    <h2>{completedCount}</h2>
                </div>

            </div>

            <div className="task-filters">

                <input
                    type="text"
                    placeholder="Search task or employee..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

                <select
                    value={priorityFilter}
                    onChange={(e) =>
                        setPriorityFilter(e.target.value)
                    }
                >
                    <option>All</option>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                </select>

                <select
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(e.target.value)
                    }
                >
                    <option>All</option>
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                </select>

            </div>

            {/* Loading */}
            {loading && (
                <div className="task-loading">
                    Loading tasks...
                </div>
            )}

            {/* Error */}
            {error && !loading && (
                <div className="task-error">
                    {error}
                </div>
            )}

            {/* Task Table */}
            {!loading && (
                <TaskTable
                    tasks={filteredTasks}
                    onEdit={handleEditTask}
                />
            )}

            <AssignTaskModal
                open={showModal}
                onClose={handleCloseModal}
                task={selectedTask}
            />

        </section>
    );
};

export default TaskManagement;