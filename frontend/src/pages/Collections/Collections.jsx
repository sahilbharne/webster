import React from 'react';

const Collections = () => {
  const collections = [
    { id: 1, name: "Digital Art", count: "124 artworks", color: "from-blue-500 to-purple-500" },
    { id: 2, name: "Photography", count: "89 artworks", color: "from-green-500 to-teal-500" },
    { id: 3, name: "3D Render", count: "67 artworks", color: "from-orange-500 to-red-500" },
    { id: 4, name: "Abstract", count: "156 artworks", color: "from-pink-500 to-rose-500" },
  ];

  return (
    <div className="pt-20 pb-10 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Your Collections</h1>
          <p className="text-gray-300 text-lg">Organize and manage your favorite artworks</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {collections.map((collection) => (
            <div key={collection.id} className={`bg-gradient-to-r ${collection.color} rounded-2xl p-6 text-white hover:shadow-2xl transition-all duration-300 hover:transform hover:scale-105`}>
              <h3 className="text-2xl font-bold mb-2">{collection.name}</h3>
              <p className="text-white/80 mb-4">{collection.count}</p>
              <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full text-sm font-medium transition-colors">
                Explore Collection
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collections;