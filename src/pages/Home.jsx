import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-sky-50 flex flex-col items-center justify-center p-6">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-sea mb-2">Welcome to StoneFlowerHome</h1>
        <p className="text-gray-700 max-w-md mx-auto">
          Your Sardinian retreat awaits. Explore the best beaches, restaurants, and attractions curated just for you.
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
        <button
          onClick={() => navigate("/wifi")}
          className="bg-sea text-white py-3 rounded-lg shadow hover:bg-sunset transition"
        >
          📶 WiFi
        </button>
        <button
          onClick={() => navigate("/explore")}
          className="bg-sea text-white py-3 rounded-lg shadow hover:bg-sunset transition"
        >
          🌅 Explore
        </button>
        <button
          onClick={() => navigate("/gallery")}
          className="bg-sea text-white py-3 rounded-lg shadow hover:bg-sunset transition"
        >
          📸 Guest Gallery
        </button>
        <button
          onClick={() => navigate("/admin")}
          className="bg-sea text-white py-3 rounded-lg shadow hover:bg-sunset transition"
        >
          🔑 Admin
        </button>
      </div>
    </div>
  );
}
