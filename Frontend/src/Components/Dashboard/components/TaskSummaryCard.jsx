import "./Card.css";

import { useMemo } from "react";
import { FaArrowRight } from "react-icons/fa";

import { useTask } from "../../../context/TaskContext";
import { useEmployees } from "../../../context/EmployeeContext";

const TaskSummaryCard = ({ setActiveSection }) => {

    const { tasks } = useTask();

    const { currentEmployee: employee } = useEmployees();
    /* ===============================
            EMPLOYEE TASKS
    =============================== */

    const summary = useMemo(() => {

        if (!employee) {

            return {
                total: 0,
                pending: 0,
                progress: 0,
                completed: 0,
            };

        }


        const employeeTasks = tasks.filter(

            task =>
                task.employeeId ===
                employee.employeeId

        );


        return {

            total: employeeTasks.length,

            pending:
                employeeTasks.filter(
                    task =>
                        task.status === "Pending"
                ).length,

            progress:
                employeeTasks.filter(
                    task =>
                        task.status === "In Progress"
                ).length,

            completed:
                employeeTasks.filter(
                    task =>
                        task.status === "Completed"
                ).length,

        };

    }, [tasks, employee]);


    /* ===============================
            VIEW ALL
    =============================== */

    const handleViewAll = () => {

        if (setActiveSection) {

            setActiveSection("tasks");

        }

    };


    return (

        <div className="dashboard-card">

            {/* ===============================
                    HEADER
            =============================== */}

            <div className="card-header">

                <h3>
                    Task Tracker
                </h3>


                <button
                    type="button"
                    className="link-btn"
                    onClick={handleViewAll}
                >

                    View All

                    <FaArrowRight />

                </button>

            </div>


            {/* ===============================
                    SUMMARY
            =============================== */}

            <div className="task-summary-grid">


                {/* TOTAL */}

                <div className="task-box">

                    <span>
                        Total
                    </span>

                    <strong>
                        {summary.total}
                    </strong>

                </div>


                {/* PENDING */}

                <div className="task-box">

                    <span>
                        Pending
                    </span>

                    <strong>
                        {summary.pending}
                    </strong>

                </div>


                {/* IN PROGRESS */}

                <div className="task-box">

                    <span>
                        In Progress
                    </span>

                    <strong>
                        {summary.progress}
                    </strong>

                </div>


                {/* COMPLETED */}

                <div className="task-box">

                    <span>
                        Completed
                    </span>

                    <strong>
                        {summary.completed}
                    </strong>

                </div>


            </div>

        </div>

    );

};


export default TaskSummaryCard;