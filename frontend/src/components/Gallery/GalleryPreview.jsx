import React from 'react';

const GalleryPreview = () => {
  const galleryItems = [
    { type: 'Art', color: 'from-purple-500 to-pink-500' },
    { type: 'Photography', color: 'from-blue-500 to-cyan-500' },
    { type: 'Writing', color: 'from-green-500 to-emerald-500' },
    { type: 'Performance', color: 'from-orange-500 to-red-500' },
  ];

  return (
    <section id="gallery" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Explore <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Creative Wonders</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover extraordinary works from talented creators around the world
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {galleryItems.map((item, index) => (
            <div 
              key={index}
              className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-500"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-80 group-hover:opacity-60 transition-opacity duration-300`}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-2xl font-bold text-white text-center px-4">{item.type}</h3>
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-sm">Explore stunning {item.type.toLowerCase()} collections from our community</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GalleryPreview;