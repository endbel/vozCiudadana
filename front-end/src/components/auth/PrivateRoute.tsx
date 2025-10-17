import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../../services/authService";

export default function PrivateRoute() {
  const authenticated = isAuthenticated();
  return authenticated ? <Outlet /> : <Navigate to="/admin" replace />;
}
