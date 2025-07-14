import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function AdminDashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("Failed to log out", err);
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-sand">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-sea mb-4 text-center">
          Welcome, Admin
        </h1>
        <p className="text-center text-olive mb-6">
          Logged in as: <span className="font-semibold">{currentUser?.email}</span>
        </p>

        <div className="flex flex-col gap-3">
          <Link
            to="/wifi"
            className="block text-center bg-sea text-white py-2 rounded hover:bg-sunset"
          >
            Edit Wi‑Fi Settings
          </Link>
          <Link
            to="/explore"
            className="block text-center bg-sea text-white py-2 rounded hover:bg-sunset"
          >
            Manage Explore Section
          </Link>
          <button
            onClick={handleLogout}
            className="mt-4 w-full bg-coral text-white py-2 rounded hover:bg-sunset"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
