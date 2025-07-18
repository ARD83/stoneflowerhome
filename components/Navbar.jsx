import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="flex justify-center gap-6 p-4 bg-sea text-sand shadow-md fixed w-full top-0 z-10">
      <Link to="/" className="hover:text-coral">Home</Link>
      <Link to="/wifi" className="hover:text-coral">Wi‑Fi</Link>
      <Link to="/explore" className="hover:text-coral">Explore</Link>
      <Link to="/gallery" className="hover:text-coral">Guest Gallery</Link>
      <Link to="/admin" className="hover:text-coral">Admin</Link>
    </nav>
  );
}
