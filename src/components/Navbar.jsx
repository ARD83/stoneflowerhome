
import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="flex justify-between p-4 bg-sea text-sand shadow-md fixed w-full top-0 z-10">
      <h1 className="font-bold text-lg">StoneFlowerHome</h1>
      <div className="flex gap-4">
        <Link to="/" className="hover:text-coral">Home</Link>
        <Link to="/wifi" className="hover:text-coral">Wi-Fi</Link>
        <Link to="/explore" className="hover:text-coral">Explore</Link>
        <Link to="/gallery" className="hover:text-coral">Gallery</Link>
        <Link to="/admin" className="hover:text-coral">Admin</Link>
      </div>
    </nav>
  );
}
