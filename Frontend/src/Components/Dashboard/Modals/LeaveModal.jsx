import "./LeaveModal.css";

import Modal from "../../../common/Modal";

import { useEmployees } from "../../../context/EmployeeContext";
import { useToast } from "../../../context/ToastContext";

const LeaveModal = ({ open, onClose }) => {

    const { employees, updateEmployee } = useEmployees();

    const { showToast } = useToast();

    const pendingLeaves = employees.filter(
        emp => emp.leave?.status === "Pending"
    );

    const approveLeave = (employee) => {

        updateEmployee({

            ...employee,

            leave: {

                ...employee.leave,

                status: "Approved",

                approvedBy: "Super Admin",

            }

        });

        showToast(
            "success",
            "Leave Approved",
            `${employee.name}'s leave has been approved.`
        );

    };

    const rejectLeave = (employee) => {

        updateEmployee({

            ...employee,

            leave: {

                ...employee.leave,

                status: "Rejected",

                approvedBy: "Super Admin",

            }

        });

        showToast(
            "info",
            "Leave Rejected",
            `${employee.name}'s leave request was rejected.`
        );

    };

    return (

        <Modal
            open={open}
            title="Leave Management"
            onClose={onClose}
            size="large"
        >

            <div className="pending-section">

                <h3>

                    Pending Leave Requests

                </h3>

                {

                    pendingLeaves.length === 0 ? (

                        <p className="empty">

                            No pending leave requests.

                        </p>

                    ) : (

                        pendingLeaves.map(employee => (

                            <div
                                key={employee.id}
                                className="leave-card"
                            >

                                <div className="leave-info">

                                    <h4>

                                        {employee.name}

                                    </h4>

                                    <span>

                                        {employee.leave.type} Leave

                                    </span>

                                    <p>

                                        <strong>From:</strong> {employee.leave.from}

                                    </p>

                                    <p>

                                        <strong>To:</strong> {employee.leave.to}

                                    </p>

                                    <p>

                                        <strong>Reason:</strong> {employee.leave.reason}

                                    </p>

                                </div>

                                <div className="leave-actions">

                                    <button
                                        className="approve"
                                        onClick={() => approveLeave(employee)}
                                    >

                                        Approve

                                    </button>

                                    <button
                                        className="reject"
                                        onClick={() => rejectLeave(employee)}
                                    >

                                        Reject

                                    </button>

                                </div>

                            </div>

                        ))

                    )

                }

            </div>

        </Modal>

    );

};

export default LeaveModal;