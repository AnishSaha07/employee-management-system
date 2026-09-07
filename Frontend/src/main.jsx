import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";

import App from "./App.jsx";

import { initializeStorage } from "./utils/storage.js";

import { EmployeeProvider } from "./context/EmployeeContext.jsx";
import { ToastProvider } from "./context/ToastContext";
import { AttendanceProvider } from "./context/AttendenceContext.jsx";
import { LeaveProvider } from "./context/LeaveContext";
import { TaskProvider } from "./context/TaskContext.jsx";
import { AnnouncementProvider } from "./context/AnnouncementContext.jsx";
import { PayrollProvider } from "./context/PayrollContext.jsx";
/* ===========================
        INITIALIZE STORAGE
=========================== */

initializeStorage();


/* ===========================
        APPLICATION
=========================== */

createRoot(document.getElementById("root")).render(

    <StrictMode>

        <EmployeeProvider>

            <AttendanceProvider>

                <LeaveProvider>

                    <TaskProvider>

                       <AnnouncementProvider>

                         <PayrollProvider>

                        <ToastProvider>

                            <App />

                        </ToastProvider>

                        </PayrollProvider>

                        </AnnouncementProvider>

                    </TaskProvider>

                </LeaveProvider>

            </AttendanceProvider>

        </EmployeeProvider>

    </StrictMode>

);