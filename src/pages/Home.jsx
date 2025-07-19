import React from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/beach-background.png"; // ✅ Your background

export default function Home() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      {/* Soft overlay */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center text-white mb-10 drop-shadow-lg">
          <h1 className="text-5xl font-bold mb-2">Welcome</h1>
          <p className="text-xl">Your Sardinian vacation home</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
          <button
            onClick={() => navigate("/explore")}
            className="flex flex-col items-center justify-center bg-white/70 rounded-xl p-6 shadow hover:bg-white transition"
          >
            <span className="text-4xl">🌅</span>
            <span className="mt-2 text-lg font-medium text-sea">Explore</span>
          </button>
          <button
            onClick={() => navigate("/gallery")}
            className="flex flex-col items-center justify-center bg-white/70 rounded-xl p-6 shadow hover:bg-white transition"
          >
            <span className="text-4xl">📸</span>
            <span className="mt-2 text-lg font-medium text-sea">Guest Gallery</span>
          </button>
          <button
            onClick={() => navigate("/wifi")}
            className="flex flex-col items-center justify-center bg-white/70 rounded-xl p-6 shadow hover:bg-white transition"
          >
            <span className="text-4xl">📶</span>
            <span className="mt-2 text-lg font-medium text-sea">Wi-Fi</span>
          </button>
          <button
            onClick={() => navigate("/house-info")}
            className="flex flex-col items-center justify-center bg-white/70 rounded-xl p-6 shadow hover:bg-white transition"
          >
            <span className="text-4xl">📶</span>
            <span className="mt-2 text-lg font-medium text-sea">House Info</span>
          </button>    
          <button
            onClick={() => navigate("/admin")}
            className="flex flex-col items-center justify-center bg-white/70 rounded-xl p-6 shadow hover:bg-white transition"
          >
            <span className="text-4xl">🔑</span>
            <span className="mt-2 text-lg font-medium text-sea">Admin</span>
          </button>
        </div>
      </div>
    </div>
  );
}
