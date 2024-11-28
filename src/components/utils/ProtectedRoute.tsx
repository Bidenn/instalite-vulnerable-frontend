import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute: React.FC = () => {
    const userId = localStorage.getItem("userId");
    return userId ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
