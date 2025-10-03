import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black/50 border-t border-white/10">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo and Copyright */}
          <Link to="/" className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">GG</span>
            </div>
            <span className="text-white font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Grand Gallery
            </span>
          </Link>

          {/* Links */}
          <div className="flex space-x-6 mb-4 md:mb-0">
            <Link to="/about" className="text-gray-400 hover:text-white transition-colors text-sm">About</Link>
            <Link to="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">Contact</Link>
            <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy</Link>
            <Link to="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">Terms</Link>
          </div>

          {/* Social Links */}
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">📘</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">🐦</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">📷</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">💼</a>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-6 mt-6 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 Grand Gallery. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;