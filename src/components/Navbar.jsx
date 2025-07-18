import React, { forwardRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

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
      className="fixed top-0 left-0 w-full bg-white shadow-md z-50 flex justify-between items-center px-4 py-3"
    >
      {/* Left: Hamburger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-800 focus:outline-none"
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>

      {/* Right: Admin icon */}
      <Link to="/admin" className="text-gray-800 hover:text-sea transition">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5.121 17.804A10 10 0 1112 22a10 10 0 01-6.879-4.196z"
          />
        </svg>
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
