import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import backgroundImage from "../assets/explore-bg.jpg"; // 🌅 use same background

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
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/10"></div>

      <div className="relative z-10 bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-sea mb-4 text-center drop-shadow">
          Welcome, Admin
        </h1>
        <p className="text-center text-olive mb-6">
          Logged in as: <span className="font-semibold">{currentUser?.email}</span>
        </p>

        <div className="flex flex-col gap-3">
          <Link
            to="/wifi"
            className="block text-center bg-sea text-white py-3 rounded-lg hover:bg-sunset transition"
          >
            ⚙️ Edit Wi‑Fi Settings
          </Link>

          <Link
            to="/explore"
            className="block text-center bg-sea text-white py-3 rounded-lg hover:bg-sunset transition"
          >
            📂 Manage Explore Section
          </Link>

          <Link
            to="/gallery"
            className="block text-center bg-sea text-white py-3 rounded-lg hover:bg-sunset transition"
          >
            📸 Manage Guest Gallery
          </Link>

          <button
            onClick={handleLogout}
            className="mt-6 w-full bg-coral text-white py-3 rounded-lg hover:bg-sunset transition"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
}
