
import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="flex justify-between p-4 bg-white shadow-md fixed w-full top-0 z-10">
      <h1 className="font-bold text-lg text-slate-800">StoneFlowerHome</h1>
      <div className="flex gap-4 text-slate-700">
        <Link to="/">Home</Link>
        <Link to="/wifi">Wi-Fi</Link>
        <Link to="/explore">Explore</Link>
        <Link to="/gallery">Gallery</Link>
        <Link to="/admin">Admin</Link>
      </div>
    </nav>
  );
}
