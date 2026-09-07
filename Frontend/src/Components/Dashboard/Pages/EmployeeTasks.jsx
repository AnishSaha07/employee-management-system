import { useEffect, useMemo, useState } from "react";
import "./EmployeeTasks.css";

import { getCurrentUser } from "../../../utils/auth";

import { useTask } from "../../../context/TaskContext";

import EmployeeTaskTable from "./EmployeeTaskTable";
import EmployeeTaskDetailsModal from "../Modals/EmployeeTaskDetailsModal";

const EmployeeTasks = () => {

    const {
        tasks,
        fetchMyTasks,
        loading,
        error,
    } = useTask();

    const currentUser = getCurrentUser();

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [priorityFilter, setPriorityFilter] = useState("All");

    const [selectedTask, setSelectedTask] = useState(null);

    // ==========================================
    // FETCH LOGGED-IN EMPLOYEE TASKS
    // ==========================================
    useEffect(() => {
        fetchMyTasks();
    }, [fetchMyTasks]);

    // ==========================================
    // FILTER EMPLOYEE TASKS
    // ==========================================
    const employeeTasks = useMemo(() => {

        if (!currentUser?.employeeId) {
            return [];
        }

        return tasks.filter(
            task =>
                task.employeeId === currentUser.employeeId
        );

    }, [tasks, currentUser?.employeeId]);

    // ==========================================
    // SEARCH + STATUS + PRIORITY FILTER
    // ==========================================
    const filteredTasks = useMemo(() => {

        return employeeTasks.filter(task => {

            const title = task.title || "";
            const description = task.description || "";

            const matchesSearch =
                title
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                description
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const matchesStatus =
                statusFilter === "All" ||
                task.status === statusFilter;

            const matchesPriority =
                priorityFilter === "All" ||
                task.priority === priorityFilter;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesPriority
            );

        });

    }, [
        employeeTasks,
        search,
        statusFilter,
        priorityFilter,
    ]);

    // ==========================================
    // SUMMARY COUNTS
    // ==========================================
    const total = employeeTasks.length;

    const pending = employeeTasks.filter(
        task => task.status === "Pending"
    ).length;

    const progress = employeeTasks.filter(
        task => task.status === "In Progress"
    ).length;

    const completed = employeeTasks.filter(
        task => task.status === "Completed"
    ).length;

    return (

        <section className="employee-tasks">

            <div className="employee-page-header">

                <div>

                    <h2>
                        My Tasks
                    </h2>

                    <p>
                        View and manage your assigned tasks.
                    </p>

                </div>

            </div>

            <div className="task-summary-cards">

                <div className="summary-card">

                    <span>Total</span>

                    <h2>
                        {total}
                    </h2>

                </div>

                <div className="summary-card">

                    <span>Pending</span>

                    <h2>
                        {pending}
                    </h2>

                </div>

                <div className="summary-card">

                    <span>In Progress</span>

                    <h2>
                        {progress}
                    </h2>

                </div>

                <div className="summary-card">

                    <span>Completed</span>

                    <h2>
                        {completed}
                    </h2>

                </div>

            </div>

            <div className="employee-toolbar">

                <input
                    type="text"
                    placeholder="Search Task..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

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

            {/* Employee Task Table */}
            {!loading && (
                <EmployeeTaskTable
                    tasks={filteredTasks}
                    onView={setSelectedTask}
                />
            )}

            <EmployeeTaskDetailsModal
                open={!!selectedTask}
                task={selectedTask}
                onClose={() => setSelectedTask(null)}
            />

        </section>
    );
};

export default EmployeeTasks;