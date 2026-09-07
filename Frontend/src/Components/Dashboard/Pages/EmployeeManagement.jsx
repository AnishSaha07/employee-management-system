import { useMemo, useState } from "react";
import "./EmployeeManagement.css";

import { FaPlus, FaSearch } from "react-icons/fa";

import EmployeeTable from "./EmployeeTable";

import { useEmployees } from "../../../context/EmployeeContext";

import AddEmployeeModal from "../Modals/AddEmployeeModal";
import DeleteEmployeeModal from "../Modals/DeleteEmployeeModal";

const EmployeeManagement = () => {

    const { employees } = useEmployees();

    /* ===========================
            STATES
    =========================== */

    const [search, setSearch] = useState("");

    const [department, setDepartment] = useState("");

    const [role, setRole] = useState("");

    const [status, setStatus] = useState("");

    const [showAddEmployee, setShowAddEmployee] = useState(false);

    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    /* ===========================
            FILTERING
    =========================== */

    const handleEdit = (employee) => {

    setSelectedEmployee(employee);

    setShowAddEmployee(true);

};


    const handleDelete = (employee) => {

    setSelectedEmployee(employee);

    setShowDeleteModal(true);

};

const departments = useMemo(() => {

    return [...new Set(

        employees
            .map(emp => emp.department?.trim())
            .filter(Boolean)

    )].sort();

}, [employees]);

    const filteredEmployees = useMemo(() => {

        return employees.filter((employee) => {

            const searchValue = search.trim().toLowerCase();

const searchableText = [

    employee.name,

    employee.employeeId,

    employee.email,

    employee.department,

    employee.designation,

].join(" ").toLowerCase();

const matchesSearch =
    searchableText.includes(searchValue);

const matchesDepartment =
    !department ||
    employee.department?.toLowerCase() === department.toLowerCase();

const matchesRole =
    !role ||
    employee.role?.toLowerCase() === role.toLowerCase();

const matchesStatus =
    !status ||
    employee.status?.toLowerCase() === status.toLowerCase();

return (

    matchesSearch &&
    matchesDepartment &&
    matchesRole &&
    matchesStatus

);

        });

    }, [
        employees,
        search,
        department,
        role,
        status,
    ]);

    return (

        <section className="employee-management">

            {/* HEADER */}

            <div className="employee-header">

                <div>

                    <h2>

                        Employee Management

                    </h2>

                    <p>

                        Manage all employees from one place.

                    </p>

                </div>

                <button
                    className="add-btn"
                    onClick={() => setShowAddEmployee(true)}
                >
                <FaPlus />
                 Add Employee
                </button>

                

            </div>

            {/* TOOLBAR */}

            <div className="employee-toolbar">

                <div className="search-box">

                    <FaSearch />

                    <input
                        type="text"
                        placeholder="Search employee..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                </div>

                <select
                    value={department}
                    onChange={(e) =>
                        setDepartment(e.target.value)
                    }
                >

                    <option value="">
                        All Departments
                    </option>

                    {
                      departments.map((dept) => (

                           <option
                              key={dept}
                              value={dept}
                           >
                         {dept}
                    </option>

    ))
}

                </select>

                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                >

                     <option value="">
                        All Roles
                     </option>

                     <option value="admin">
                         Admin
                     </option>

                     <option value="employee">
                        Employee
                     </option>

                </select>

                <select
                   value={status}
                   onChange={(e) => setStatus(e.target.value)}
                >

                <option value="">
                   All Status
                </option>

                <option value="Active">
                    Active
                </option>

             <option value="Inactive">
                    Inactive
             </option>

              <option value="On Leave">
                   On Leave
             </option>

             </select>

             <button
    className="reset-btn"
    onClick={() => {

        setSearch("");

        setDepartment("");

        setRole("");

        setStatus("");

    }}
>

    Reset

</button>

            </div>

            {/* TABLE */}

            <EmployeeTable

                employees={filteredEmployees}
                  onEdit={handleEdit}
                  onDelete={handleDelete}

            />

            <AddEmployeeModal
                open={showAddEmployee}
                employee={selectedEmployee}
                onClose={() => {

                    setShowAddEmployee(false);
  
                    setSelectedEmployee(null);

                }}
            />


            <DeleteEmployeeModal
                 open={showDeleteModal}
                  employee={selectedEmployee}
                  onClose={() => {

                   setShowDeleteModal(false);

                 setSelectedEmployee(null);

                 }}
            />

        </section>

    );

};

export default EmployeeManagement;