import React from "react";
import { Image, Camera, PenTool, Music } from "lucide-react";

const GalleryPreview = () => {
  const galleryItems = [
    { 
      type: "Art", 
      color: "from-purple-500 via-pink-500 to-red-500", 
      icon: <Image className="w-12 h-12 text-white/90" /> 
    },
    { 
      type: "Photography", 
      color: "from-blue-500 via-cyan-500 to-teal-500", 
      icon: <Camera className="w-12 h-12 text-white/90" /> 
    },
    { 
      type: "Writing", 
      color: "from-green-500 via-emerald-500 to-lime-500", 
      icon: <PenTool className="w-12 h-12 text-white/90" /> 
    },
    { 
      type: "Performance", 
      color: "from-orange-500 via-red-500 to-pink-500", 
      icon: <Music className="w-12 h-12 text-white/90" /> 
    },
  ];

  return (
    <section id="gallery" className="py-24 px-6 relative overflow-hidden">
      {/* Animated Gradient Background Blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse -z-10" />
      <div className="absolute top-1/2 right-0 w-[30rem] h-[30rem] bg-blue-500/20 rounded-full blur-3xl animate-pulse -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            Explore{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Creative Wonders
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Discover extraordinary works from talented creators around the world.
          </p>
        </div>

        {/* Grid of Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {galleryItems.map((item, index) => (
            <div
              key={index}
              className="group relative h-80 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-700 transform hover:-translate-y-2 hover:scale-105"
              style={{
                animation: `fadeInUp 0.6s ease forwards`,
                animationDelay: `${index * 0.15}s`,
                opacity: 0,
              }}
            >
              {/* Gradient Overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-90 group-hover:opacity-70 transition-opacity duration-500`}
              />

              {/* Icon + Title */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-4 z-10">
                <div className="transform group-hover:scale-110 transition-transform duration-500">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold text-white">{item.type}</h3>
              </div>

              {/* Hover Overlay Description */}
              <div className="absolute bottom-0 left-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
                <div className="bg-black/50 backdrop-blur-md rounded-2xl p-4">
                  <p className="text-sm text-gray-200">
                    Explore stunning {item.type.toLowerCase()} collections from
                    our community.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Keyframes for Animation */}
      <style>
        {`
          @keyframes fadeInUp {
            0% { transform: translateY(30px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
        `}
      </style>
    </section>
  );
};

export default GalleryPreview;
