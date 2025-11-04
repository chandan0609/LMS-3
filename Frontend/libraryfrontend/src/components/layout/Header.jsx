import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white shadow-md py-4 px-6 flex items-center justify-between">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        📚 Library System
      </Link>

      <nav className="flex space-x-6">
        <Link to="/" className="text-gray-700 hover:text-blue-600">
          Home
        </Link>
        <Link to="/about" className="text-gray-700 hover:text-blue-600">
          About
        </Link>
        <Link to="/contact" className="text-gray-700 hover:text-blue-600">
          Contact
        </Link>
        <Link to="/login" className="text-gray-700 hover:text-blue-600">
          Login
        </Link>
      </nav>
    </header>
  );
};

export default Header;
