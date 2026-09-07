import "./EmployeeTaskTable.css";

import { FaEye } from "react-icons/fa";

const EmployeeTaskTable = ({
    tasks = [],
    onView,
}) => {

    return (

        <div className="employee-task-table-card">

            <table className="employee-task-table">

                <thead>

                    <tr>

                        <th>Task</th>
                        <th>Priority</th>
                        <th>Due Date</th>
                        <th>Assigned By</th>
                        <th>Status</th>
                        <th>Action</th>

                    </tr>

                </thead>

                <tbody>

                    {tasks.length === 0 ? (

                        <tr>

                            <td
                                colSpan="6"
                                className="empty-row"
                            >
                                No Tasks Found
                            </td>

                        </tr>

                    ) : (

                        tasks.map((task) => {

                            const taskId =
                                task.id ||
                                task._id;

                            const priority =
                                task.priority ||
                                "Medium";

                            const status =
                                task.status ||
                                "Pending";

                            const assignedBy =
                                typeof task.assignedBy === "object"
                                    ? task.assignedBy?.name ||
                                      task.assignedBy?.employeeId ||
                                      "--"
                                    : task.assignedBy ||
                                      "Admin";

                            return (

                                <tr key={taskId}>

                                    {/* TASK */}

                                    <td>

                                        <div>

                                            <h4>
                                                {task.title || "--"}
                                            </h4>

                                            <small>
                                                {task.description || ""}
                                            </small>

                                        </div>

                                    </td>

                                    {/* PRIORITY */}

                                    <td>

                                        <span
                                            className={`priority ${priority.toLowerCase()}`}
                                        >
                                            {priority}
                                        </span>

                                    </td>

                                    {/* DUE DATE */}

                                    <td>

                                        {task.dueDate || "--"}

                                    </td>

                                    {/* ASSIGNED BY */}

                                    <td>

                                        {assignedBy}

                                    </td>

                                    {/* STATUS */}

                                    <td>

                                        <span
                                            className={`status ${status
                                                .toLowerCase()
                                                .replace(/\s/g, "-")}`}
                                        >
                                            {status}
                                        </span>

                                    </td>

                                    {/* ACTION */}

                                    <td>

                                        <button
                                            type="button"
                                            className="view-btn"
                                            onClick={() =>
                                                onView(task)
                                            }
                                        >
                                            <FaEye />
                                        </button>

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

export default EmployeeTaskTable;