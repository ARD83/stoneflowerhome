import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  const ADMIN_EMAIL = "stoneflowerhome@gmail.com";

  // ✅ Check if the user is logged in and is admin
  if (!currentUser) {
    return <Navigate to="/admin" replace />;
  }
  if (currentUser.email !== ADMIN_EMAIL) {
    return <Navigate to="/" replace />;
  }

  return children;
}
