import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError("");
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Failed to log in. Check your credentials.");
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-sand">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold text-sea mb-4 text-center">
          Admin Login
        </h1>
        {error && (
          <p className="bg-coral text-white p-2 rounded mb-2 text-center">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border border-olive rounded focus:outline-none focus:ring-2 focus:ring-sea"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border border-olive rounded focus:outline-none focus:ring-2 focus:ring-sea"
          />
          <button
            type="submit"
            className="w-full bg-sea text-white p-2 rounded hover:bg-sunset"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
