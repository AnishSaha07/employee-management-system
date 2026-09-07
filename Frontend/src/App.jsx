import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./Components/LandingPage/LandingPage";
import Login from "./Components/Auth/Login";
import AdminDashboard from "./Components/Dashboard/Main/AdminDashboard";
import EmployeeDashboard from "./Components/Dashboard/Main/EmployeeDashboard";

import ProtectedRoute from "./Protected/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee"
          element={
            <ProtectedRoute allowedRole="employee">
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;