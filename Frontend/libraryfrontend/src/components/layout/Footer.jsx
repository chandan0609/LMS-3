import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 text-center text-gray-600 py-6 mt-12 border-t">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm">
            © {year} <span className="font-semibold text-blue-600">Library System</span>. All rights reserved.
          </p>

          <div className="flex space-x-4 mt-3 md:mt-0">
            <Link to="/privacy" className="hover:text-blue-600 text-sm">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-blue-600 text-sm">
              Terms of Service
            </Link>
            <Link to="/contact" className="hover:text-blue-600 text-sm">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
