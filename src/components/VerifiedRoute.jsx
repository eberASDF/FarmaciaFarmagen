import { Navigate, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function VerifiedRoute({ children, requiredRole, loginPath = "/login" }) {
  const { user } = useApp();
  const location = useLocation();
  const from = `${location.pathname}${location.search || ""}`;

  if (!user) {
    return <Navigate to={loginPath} replace state={{ from }} />;
  }

  if (!user.emailVerified) {
    return <Navigate to="/login" replace state={{ from }} />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}
