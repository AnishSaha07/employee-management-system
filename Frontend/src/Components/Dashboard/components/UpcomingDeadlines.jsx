import "./Card.css";

import { useMemo } from "react";
import { FaArrowRight } from "react-icons/fa";

import { useTask } from "../../../context/TaskContext";
import { useEmployees } from "../../../context/EmployeeContext";

const UpcomingDeadlines = ({ setActiveSection }) => {

    const { tasks } = useTask();

    const { currentEmployee: employee } = useEmployees();


    /* ===============================
            UPCOMING TASKS
    =============================== */

    const upcomingTasks = useMemo(() => {

        if (!employee) return [];

        return tasks

            .filter(task =>

                task.employeeId ===
                employee.employeeId &&

                task.status !== "Completed"

            )

            .sort((a, b) => {

                return (
                    new Date(a.dueDate) -
                    new Date(b.dueDate)
                );

            })

            .slice(0, 4);

    }, [tasks, employee]);


    /* ===============================
            DAYS LEFT
    =============================== */

    const getDaysLeft = (dueDate) => {

        if (!dueDate) return "No due date";

        const today = new Date();

        today.setHours(0, 0, 0, 0);


        const due = new Date(dueDate);

        due.setHours(0, 0, 0, 0);


        const diff = Math.ceil(

            (due - today) /
            (1000 * 60 * 60 * 24)

        );


        if (diff < 0) {

            return "Overdue";

        }


        if (diff === 0) {

            return "Today";

        }


        if (diff === 1) {

            return "Tomorrow";

        }


        return `${diff} days left`;

    };


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
                    Upcoming Deadlines
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
                    EMPTY STATE
            =============================== */}

            {upcomingTasks.length === 0 ? (

                <p className="card-subtitle">

                    No upcoming tasks.

                </p>

            ) : (


                /* ===============================
                        TASK LIST
                =============================== */

                upcomingTasks.map(task => (

                    <div
                        className="deadline-item"
                        key={task.id}
                    >

                        <div>

                            <strong>
                                {task.title}
                            </strong>

                            <p>
                                {task.priority || "Normal"} Priority
                            </p>

                        </div>


                        <span
                            className={
                                getDaysLeft(task.dueDate) === "Overdue"
                                    ? "deadline-overdue"
                                    : ""
                            }
                        >

                            {getDaysLeft(task.dueDate)}

                        </span>

                    </div>

                ))

            )}

        </div>

    );

};


export default UpcomingDeadlines;