import { Navigate, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function VerifiedRoute({ children, requiredRole, loginPath = "/login" }) {
  const { user } = useApp();
  const location = useLocation();

  if (!user) {
    return <Navigate to={loginPath} replace state={{ from: location.pathname }} />;
  }

  if (!user.emailVerified) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}
