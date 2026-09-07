const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const settingsRoutes =require("./routes/settingsRoutes");
const leaveRoutes = require("./routes/leaveRoutes");
const payrollRoutes = require("./routes/payrollRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);
// ==========================================
// MIDDLEWARE
// ==========================================

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));


// ==========================================
// ROUTES
// ==========================================

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/employees",
    employeeRoutes
);

app.use(
    "/api/attendance",
    attendanceRoutes
);

app.use(
    "/api/settings",
    settingsRoutes
);

app.use(
    "/api/leaves",
     leaveRoutes
    );

app.use(
    "/api/payroll",
     payrollRoutes
    );

app.use(
    "/api/tasks",
     taskRoutes
    );    

// ==========================================
// TEST
// ==========================================

app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "EMS API is running.",
    });

});


module.exports = app;