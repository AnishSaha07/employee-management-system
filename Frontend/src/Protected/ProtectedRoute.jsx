import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../utils/auth";

const ProtectedRoute = ({ children, allowedRole }) => {

  const user = getCurrentUser();

  // User not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Wrong role
  if (user.role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;