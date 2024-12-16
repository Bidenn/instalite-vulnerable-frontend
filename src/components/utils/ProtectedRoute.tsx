import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute: React.FC = () => {
    const loggedUser = localStorage.getItem("loggedUser");
    return loggedUser ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
