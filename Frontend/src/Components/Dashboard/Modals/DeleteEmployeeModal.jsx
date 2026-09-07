import "./DeleteEmployeeModal.css";

import Modal from "../../../common/Modal";

import { useEmployees } from "../../../context/EmployeeContext";
import { useToast } from "../../../context/ToastContext";

const DeleteEmployeeModal = ({
    open,
    onClose,
    employee,
}) => {

    const { deleteEmployee } = useEmployees();

    const { showToast } = useToast();

    if (!employee) return null;

    const handleDelete = () => {

        deleteEmployee(employee.id);

        showToast(

            "success",

            "Employee Deleted",

            `${employee.name} has been removed successfully.`

        );

        onClose();

    };

    return (

        <Modal
            open={open}
            title="Delete Employee"
            onClose={onClose}
        >

            <div className="delete-container">

                <div className="warning-icon">

                    ⚠️

                </div>

                <h2>

                    Delete Employee?

                </h2>

                <p>

                    You are about to permanently remove

                </p>

                <h3>

                    {employee.name}

                </h3>

                <span>

                    {employee.employeeId}

                </span>

                <p className="warning-text">

                    This action cannot be undone.

                </p>

                <div className="delete-buttons">

                    <button
                        className="cancel-btn"
                        onClick={onClose}
                    >

                        Cancel

                    </button>

                    <button
                        className="delete-btn"
                        onClick={handleDelete}
                    >

                        Delete Employee

                    </button>

                </div>

            </div>

        </Modal>

    );

};

export default DeleteEmployeeModal;