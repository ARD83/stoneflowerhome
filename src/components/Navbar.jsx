import React, { forwardRef } from "react";
import { Link } from "react-router-dom";

const Navbar = forwardRef((props, ref) => {
  return (
    <nav
      ref={ref}
      className="fixed top-0 left-0 w-full bg-white shadow-md z-50"
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo or Title */}
        <Link to="/" className="text-2xl font-bold text-sea">
          StoneFlowerHome
        </Link>

        {/* Navigation Links */}
        <div className="flex gap-6 text-gray-700 font-medium">
          <Link to="/wifi" className="hover:text-sea transition">
            Wifi
          </Link>
          <Link to="/explore" className="hover:text-sea transition">
            Explore
          </Link>
          <Link to="/gallery" className="hover:text-sea transition">
            Guest Gallery
          </Link>
          <Link to="/admin" className="hover:text-sea transition">
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
});

export default Navbar;
