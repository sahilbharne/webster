import React from "react";
import { Facebook, Twitter, Instagram, Youtube, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-black/60 backdrop-blur-xl border-t border-white/10 py-16 px-6">
      {/* Gradient Background Glow */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                <span className="text-white font-extrabold text-lg">GG</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Grand Gallery
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed max-w-md">
              A timeless digital sanctuary for creative expression, preservation,
              and community collaboration. Explore, connect, and inspire.
            </p>

            {/* Social Icons */}
            <div className="flex space-x-4 mt-6">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-purple-400 transition-all duration-300"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-5">Platform</h4>
            <ul className="space-y-2">
              {["Gallery", "Artists", "Collections", "Exhibitions"].map(
                (link, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white hover:pl-1 inline-block transition-all duration-300"
                    >
                      {link}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-5">Support</h4>
            <ul className="space-y-2">
              {["Help Center", "Community", "Contact", "Privacy"].map(
                (link, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white hover:pl-1 inline-block transition-all duration-300"
                    >
                      {link}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <h5 className="text-white text-lg font-semibold">
            Stay inspired with our newsletter ✨
          </h5>
          <form className="flex w-full md:w-auto gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
            />
            <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 flex items-center gap-2">
              <Mail className="w-4 h-4" /> Subscribe
            </button>
          </form>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-10 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 Grand Gallery of Wonders. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
