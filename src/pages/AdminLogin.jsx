import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to log in. Check your credentials.");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <div className="bg-white p-6 rounded shadow-md w-80">
        <h1 className="text-2xl font-bold mb-4 text-center">Admin Login</h1>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 mb-3 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 mb-3 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-700 text-white p-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
