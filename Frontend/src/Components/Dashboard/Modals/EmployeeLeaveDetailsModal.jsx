import "./EmployeeLeaveDetailsModal.css";

import Modal from "../../../common/Modal";

const EmployeeLeaveDetailsModal = ({
    open,
    leave,
    onClose,
}) => {

    if (!leave) return null;

    return (

        <Modal
            open={open}
            title="Leave Details"
            onClose={onClose}
        >

            <div className="leave-details">

                <div className="detail-item">

                    <label>Leave Type</label>

                    <p>{leave.leaveType}</p>

                </div>

                <div className="detail-item">

                    <label>From Date</label>

                    <p>{leave.fromDate}</p>

                </div>

                <div className="detail-item">

                    <label>To Date</label>

                    <p>{leave.toDate}</p>

                </div>

                <div className="detail-item">

                    <label>Reason</label>

                    <p>{leave.reason}</p>

                </div>

                <div className="detail-item">

                    <label>Applied On</label>

                    <p>{leave.appliedAt}</p>

                </div>

                <div className="detail-item">

                    <label>Status</label>

                    <span
                        className={`status ${leave.status.toLowerCase()}`}
                    >

                        {leave.status}

                    </span>

                </div>

                {

                    leave.status === "Approved" && (

                        <>

                            <div className="detail-item">

                                <label>Approved By</label>

                                <p>{leave.approvedBy}</p>

                            </div>

                            <div className="detail-item">

                                <label>Approved On</label>

                                <p>{leave.approvedAt}</p>

                            </div>

                        </>

                    )

                }

                {

                    leave.status === "Rejected" && (

                        <>

                            <div className="detail-item">

                                <label>Rejected By</label>

                                <p>{leave.rejectedBy}</p>

                            </div>

                            <div className="detail-item">

                                <label>Rejected On</label>

                                <p>{leave.rejectedAt}</p>

                            </div>

                        </>

                    )

                }

            </div>

        </Modal>

    );

};

export default EmployeeLeaveDetailsModal;