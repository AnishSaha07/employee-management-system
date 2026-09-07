import React from "react";
import { useEmployees } from "../../../context/EmployeeContext";
import "./EmployeeOverview.css";

const EmployeeOverview = () => {

  const { employees } = useEmployees();

  // Count by department
  const deptMap = {};
  employees.forEach((emp) => {
    const dept = emp.department || "Unknown";
    deptMap[dept] = (deptMap[dept] || 0) + 1;
  });

  const departments = Object.entries(deptMap).sort((a, b) => b[1] - a[1]);
  const max = departments[0]?.[1] || 1;

  const colors = ["#2563eb", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4"];

  return (
    <div className="dashboard-box emp-overview">

      <div className="box-header">
        <h3>Department Overview</h3>
        <span className="badge-count">{employees.length} Total</span>
      </div>

      {departments.length === 0 ? (
        <div className="empty-state">No employees yet</div>
      ) : (
        <div className="dept-list">
          {departments.map(([dept, count], i) => (
            <div key={dept} className="dept-row">

              <div className="dept-meta">
                <span className="dept-name">{dept}</span>
                <span className="dept-count">{count}</span>
              </div>

              <div className="dept-bar-bg">
                <div
                  className="dept-bar-fill"
                  style={{
                    width: `${(count / max) * 100}%`,
                    background: colors[i % colors.length],
                  }}
                />
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default EmployeeOverview;