import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const { currentUser, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const ADMIN_EMAIL = "stoneflowerhome@gmail.com";

  // ✅ Check if already logged in
  useEffect(() => {
    if (currentUser && currentUser.email === ADMIN_EMAIL) {
      navigate("/dashboard"); // Redirect to Admin Dashboard
    }
  }, [currentUser, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/dashboard"); // Redirect after login
    } catch (err) {
      console.error("Login failed:", err);
      setError("Failed to log in. Check your credentials.");
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-sand">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-sea mb-4 text-center">Admin Login</h1>

        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border rounded p-2"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border rounded p-2"
          />
          <button
            type="submit"
            className="bg-sea text-white py-2 rounded hover:bg-sunset transition"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}
