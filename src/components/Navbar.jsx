import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-sea text-sand shadow-md z-10">
      <div className="flex justify-center gap-6 p-4">
        <Link to="/" className="hover:text-coral transition-colors">
          Home
        </Link>
        <Link to="/wifi" className="hover:text-coral transition-colors">
          Wi‑Fi
        </Link>
        <Link to="/explore" className="hover:text-coral transition-colors">
          Explore
        </Link>
        <Link to="/gallery" className="hover:text-coral transition-colors">
          Gallery
        </Link>
        <Link to="/admin" className="hover:text-coral transition-colors">
          Admin
        </Link>
      </div>
    </nav>
  );
}
