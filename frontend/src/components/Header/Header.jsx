import React, { useState } from "react";
import {
  Search,
  Bell,
  User,
  Settings,
  HelpCircle,
  LogOut,
  LayoutGrid,
  Heart,
  Image,
  BarChart,
  Plus,
  Menu,
  X,
} from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [hasNotifications] = useState(true);
  const [activeNav, setActiveNav] = useState("discover");

  const navItems = [
    { id: "discover", label: "Discover", icon: Search, color: "from-blue-500 to-cyan-500" },
    { id: "collections", label: "Collections", icon: Image, color: "from-purple-500 to-pink-500" },
    { id: "saved", label: "Saved", icon: Heart, color: "from-red-500 to-orange-500" },
    { id: "dashboard", label: "Dashboard", icon: BarChart, color: "from-green-500 to-emerald-500" },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-md shadow-purple-500/30">
              <span className="text-white font-bold text-sm">GG</span>
            </div>
            <span className="text-white text-xl font-bold tracking-wide">
              Grand <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Gallery</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 bg-white/5 rounded-2xl p-1 border border-white/10">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`relative flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                  activeNav === item.id
                    ? `text-white bg-gradient-to-r ${item.color} shadow-lg`
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon size={16} />
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search artwork or artist..."
                className="w-full bg-white/10 border border-white/20 rounded-full px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pl-12"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <kbd className="px-2 py-1 text-xs text-gray-400 bg-black/50 rounded border border-white/10">⌘K</kbd>
              </div>
            </div>
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Upload */}
            <button className="group relative bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 flex items-center space-x-2">
              <Plus size={16} />
              <span>Upload</span>
            </button>

            {/* Notifications */}
            <button className="relative p-2.5 text-gray-300 hover:text-white transition-all duration-300 hover:bg-white/5 rounded-lg group">
              <Bell size={20} className="transition-transform duration-300 group-hover:scale-110" />
              {hasNotifications && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse ring-2 ring-black"></span>
              )}
            </button>

            {/* Profile */}
            <div className="relative group">
              <button className="w-9 h-9 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-white/20">
                U
              </button>
              {/* Dropdown */}
              <div className="absolute right-0 top-full mt-3 w-64 bg-gradient-to-br from-gray-900 to-black backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      U
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold text-sm truncate">User Name</h3>
                      <p className="text-gray-400 text-xs truncate">@username</p>
                    </div>
                  </div>
                  <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2.5 px-4 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 flex items-center justify-center space-x-2">
                    <Plus size={16} />
                    <span>Upload New Artwork</span>
                  </button>
                </div>

                <div className="p-3 space-y-1">
                  <a href="#profile" className="profile-dropdown-item">
                    <User size={16} className="text-blue-400" />
                    <span className="flex-1 text-white text-sm">Profile</span>
                  </a>
                  <a href="#settings" className="profile-dropdown-item">
                    <Settings size={16} className="text-gray-400" />
                    <span className="flex-1 text-white text-sm">Settings</span>
                  </a>
                  <a href="#help" className="profile-dropdown-item">
                    <HelpCircle size={16} className="text-green-400" />
                    <span className="flex-1 text-white text-sm">Help Center</span>
                  </a>
                </div>

                <div className="p-3 border-t border-white/10">
                  <a href="#logout" className="profile-dropdown-item text-red-400 hover:text-red-300">
                    <LogOut size={16} className="text-red-400" />
                    <span className="flex-1 text-sm">Logout</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center space-x-4 md:hidden">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-gray-300 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
            >
              <Search size={20} />
            </button>
            <button
              className="text-white relative p-2 hover:bg-white/5 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && (
          <div className="md:hidden mt-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search artwork or artist..."
                className="w-full bg-white/10 border border-white/20 rounded-full px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pl-12"
              />
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-white/10 pt-4">
            <div className="grid grid-cols-2 gap-2 mb-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={`flex items-center space-x-2 p-3 rounded-xl font-medium transition-all duration-300 ${
                    activeNav === item.id
                      ? `text-white bg-gradient-to-r ${item.color} shadow-lg`
                      : "text-gray-300 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <item.icon size={16} />
                  <span className="text-sm">{item.label}</span>
                </button>
              ))}
            </div>

            <div className="border-t border-white/10 pt-4 space-y-2">
              <button className="w-full flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold justify-center">
                <Plus size={16} />
                <span>Upload Artwork</span>
              </button>
              <a href="#profile" className="flex items-center space-x-3 p-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg">
                <User size={16} />
                <span>Profile</span>
              </a>
              <a href="#settings" className="flex items-center space-x-3 p-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg">
                <Settings size={16} />
                <span>Settings</span>
              </a>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .profile-dropdown-item {
          @apply flex items-center space-x-3 w-full px-3 py-3 rounded-xl transition-all duration-200 text-sm hover:bg-white/5;
        }
      `}</style>
    </header>
  );
};

export default Header;
