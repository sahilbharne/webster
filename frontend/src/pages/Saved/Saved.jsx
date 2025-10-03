import React from 'react';

const Saved = () => {
  const savedItems = [
    { id: 1, title: "Mountain Serenity", artist: "Lisa Wang", type: "Photography", savedDate: "2 days ago" },
    { id: 2, title: "Cyber City", artist: "Tom Hanks", type: "Digital Art", savedDate: "1 week ago" },
    { id: 3, title: "Ocean Dreams", artist: "Emma Stone", type: "Painting", savedDate: "3 weeks ago" },
  ];

  return (
    <div className="pt-20 pb-10 px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Saved Artworks</h1>
          <p className="text-gray-300 text-lg">Your personal collection of favorite pieces</p>
        </div>

        <div className="space-y-4">
          {savedItems.map((item) => (
            <div key={item.id} className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold text-lg mb-1">{item.title}</h3>
                  <p className="text-gray-400 text-sm">by {item.artist} • {item.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-sm mb-2">{item.savedDate}</p>
                  <div className="space-x-2">
                    <button className="text-green-400 hover:text-green-300 text-sm font-medium">
                      View
                    </button>
                    <button className="text-red-400 hover:text-red-300 text-sm font-medium">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Saved;