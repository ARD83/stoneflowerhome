import React, { forwardRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User } from "lucide-react"; // Icons

const Navbar = forwardRef((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Wifi", path: "/wifi" },
    { name: "Explore", path: "/explore" },
    { name: "Guest Gallery", path: "/gallery" },
  ];

  return (
    <nav
      ref={ref}
      className="fixed top-0 left-0 w-full bg-sea shadow-md z-50 flex justify-between items-center px-4 py-3"
    >
      {/* Left: Hamburger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-800 focus:outline-none"
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Right: Admin icon */}
      <Link to="/admin" className="text-gray-800 hover:text-sea transition">
        <User size={28} />
      </Link>

      {/* Sliding Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-64 bg-white shadow-lg rounded-r-lg p-4 z-40">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)} // Close on click
              className={`block py-2 px-3 rounded hover:bg-gray-100 ${
                location.pathname === link.path
                  ? "bg-sea text-white"
                  : "text-gray-800"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
});

export default Navbar;
