import "./EmployeeTable.css";

import {
    FaEdit,
    FaTrash,
} from "react-icons/fa";

const EmployeeTable = ({ employees,onEdit, onDelete, }) => {

    return (

        <div className="employee-table-card">

            <table className="employee-table">

                <thead>

                    <tr>

                        <th>Employee</th>
                        <th>Department</th>
                        <th>Role</th>
                        <th>Salary</th>
                        <th>Status</th>
                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        employees.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="6"
                                    className="empty-row"
                                >

                                    No Employees Found

                                </td>

                            </tr>

                        ) : (

                            employees.map((employee) => (

                                <tr key={employee.id}>

                                    <td>

                                        <div className="employee-info">

                                            <div className="employee-avatar">

                                                {
                                                    employee.name
                                                        .split(" ")
                                                        .map(word => word[0])
                                                        .join("")
                                                        .toUpperCase()
                                                }

                                            </div>

                                            <div>

                                                <h4>{employee.name}</h4>

                                                <span>{employee.email}</span>

                                                <small>{employee.employeeId}</small>

                                            </div>

                                        </div>

                                    </td>

                                    <td>{employee.department}</td>

                                    <td>{employee.role}</td>

                                    <td>

                                        ₹{Number(employee.salary).toLocaleString()}

                                    </td>

                                    <td>

                                        <span className="status active">

                                            {employee.status}

                                        </span>

                                    </td>

                                    <td>

                                        <div className="action-buttons">

                                            <button
                                                className="edit-btn"
                                                onClick={() => onEdit(employee)}
                                            >

                                             <FaEdit />

                                            </button>

                                            <button className="delete-btn"
                                                 onClick={() => onDelete(employee)}
                                                 >

                                                <FaTrash />

                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))

                        )

                    }

                </tbody>

            </table>

        </div>

    );

};

export default EmployeeTable;