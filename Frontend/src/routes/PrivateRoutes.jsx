// src/routes/PrivateRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const PrivateRoute = () => {
  const { token } = useAuth();
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export const SuperAdminRoute = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  return user.role === "super-admin"
    ? <Outlet />
    : <Navigate to="/dashboard" replace />;
};
