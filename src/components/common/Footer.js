import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          {/* Copyright Section */}
          <div className="text-center md:text-left text-sm text-gray-400">
            <p>&copy; 2024 Your Company. All rights reserved.</p>
          </div>

          {/* Social Media Icons Section */}
          <div className="flex justify-center space-x-6">
            <Link to="/facebook" className="text-gray-400 hover:text-white">
              <i className="fab fa-facebook-f text-2xl"></i>
            </Link>
            <Link to="/twitter" className="text-gray-400 hover:text-white">
              <i className="fab fa-twitter text-2xl"></i>
            </Link>
            <Link to="/instagram" className="text-gray-400 hover:text-white">
              <i className="fab fa-instagram text-2xl"></i>
            </Link>
            <Link to="/linkedin" className="text-gray-400 hover:text-white">
              <i className="fab fa-linkedin-in text-2xl"></i>
            </Link>
            <Link to="/github" className="text-gray-400 hover:text-white">
              <i className="fab fa-github text-2xl"></i>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
