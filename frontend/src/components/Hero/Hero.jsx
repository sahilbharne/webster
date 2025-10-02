import React from "react";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated background blobs */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-black"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full mix-blend-multiply filter blur-[120px] animate-pulse"></div>
        <div
          className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-[120px] animate-pulse"
          style={{ animationDelay: "2000ms" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-[120px] animate-pulse"
          style={{ animationDelay: "4000ms" }}
        ></div>
      </div>

      {/* Hero content */}
      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight mb-6 leading-tight">
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">
            Grand Gallery
          </span>
          <br />
          <span className="text-4xl md:text-6xl text-white/90">of Wonders</span>
        </h1>

        <p className="text-lg md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
          Where fleeting creativity finds its eternal stage. <br />
          Preserve, showcase, and discover extraordinary works of art in a
          timeless digital sanctuary.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-16">
          <button className="relative group bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg shadow-purple-600/25 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-purple-500/40">
            <span className="relative z-10 flex items-center gap-2">
              Start Your Gallery <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>

          <button className="border-2 border-purple-500 text-purple-300 px-8 py-4 rounded-full font-semibold text-lg hover:bg-purple-500/10 hover:text-white transition-all duration-300">
            Explore Masterpieces
          </button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          {[
            { number: "10K+", label: "Creative Works" },
            { number: "5K+", label: "Artists" },
            { number: "1M+", label: "Appreciations" },
          ].map((stat, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
            >
              <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
              <div className="text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-8 h-14 border-2 border-white/40 rounded-full flex justify-center items-start p-2">
          <div className="w-1 h-3 bg-white rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
