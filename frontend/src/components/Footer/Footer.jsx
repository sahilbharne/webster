import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col items-center space-y-4">
          
          {/* Brand */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">AH</span>
            </div>
            <span className="text-white font-semibold">ArtHive</span>
          </Link>

          {/* Simple Links */}
          <div className="flex space-x-6">
            <Link to="/discover" className="text-gray-400 hover:text-white transition-colors text-sm">
              Discover
            </Link>
            <Link to="/collections" className="text-gray-400 hover:text-white transition-colors text-sm">
              Collections
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-gray-500 text-xs">
            © 2024 ArtHive
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;