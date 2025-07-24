import React from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/beach-background.png";

export default function Home() {
  const navigate = useNavigate();

  const buttons = [

    { label: "Explore", path: "/explore", colorClass: "bg-golden_mirage hover:bg-green-400" },
    { label: "Guest Gallery", path: "/gallery", colorClass: "bg-coastal_teal hover:bg-pink-400" },
    { label: "House Info", path: "/house-info", colorClass: "bg-deep_lagoon hover:bg-purple-400" },
    { label: "Wi‑Fi", path: "/wifi", colorClass: "bg-sunkissed_sand hover:bg-blue-400" },
    { label: "Admin", path: "/admin", colorClass: "bg-luminous_perl hover:bg-red-400" },
  ];

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4 py-20 text-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="bg-white/80 backdrop-blur-md rounded-xl p-8 shadow-lg max-w-2xl w-full">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-yellow-600 font-serif">
          Welcome to Stoneflower Home
        </h1>
        <p className="text-lg text-gray-700 mb-6 font-sans">
          Your peaceful escape in Sardinia.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {buttons.map((btn) => (
            <button
              key={btn.label}
              onClick={() => navigate(btn.path)}
              className={`w-full sm:w-auto ${btn.colorClass} text-navy-900 font-semibold py-3 px-6 rounded-xl shadow-md transition`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
