// components/Hero.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-black w-full px-4 pt-20 pb-20">
      <div className="w-full max-w-6xl mx-auto text-center">
        
        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight">
          Welcome to
          <br />
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
            Grand Gallery
          </span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
          Discover, create, and share amazing artwork with a global community of artists and art lovers.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <Link 
            to="/discover"
            className="group relative bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 transform hover:scale-105 w-full sm:w-auto text-center"
          >
            Explore Artworks
          </Link>
          
          <Link 
            to="/dashboard"
            className="group relative border border-white/20 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/5 transition-all duration-300 w-full sm:w-auto text-center"
          >
            Your Dashboard
          </Link>
        </div>

        {/* Why Choose Section */}
        <div className="mt-20 pt-12 border-t border-white/10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">
            Why Choose <span className="text-purple-400">Grand Gallery</span>?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white text-xl mb-4 mx-auto">
                🌎
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Global Community</h3>
              <p className="text-gray-300 text-sm">
                Connect with artists worldwide and share your passion for art.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white text-xl mb-4 mx-auto">
                🎨
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Showcase Art</h3>
              <p className="text-gray-300 text-sm">
                Display your creations and build your artistic portfolio online.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white text-xl mb-4 mx-auto">
                💫
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Discover Talent</h3>
              <p className="text-gray-300 text-sm">
                Explore incredible artwork from emerging and established artists.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;