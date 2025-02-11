// src/ProtectedRoute.js
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, isSubAdminAuthenticated }) {
  return isSubAdminAuthenticated ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
