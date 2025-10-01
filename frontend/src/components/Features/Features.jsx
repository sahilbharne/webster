import React from 'react';

const Features = () => {
  const features = [
    {
      icon: "🤖",
      title: "AI-Powered Discovery",
      description: "Intelligent recommendations and automatic content tagging powered by advanced AI algorithms."
    },
    {
      icon: "🔍",
      title: "Similarity Search",
      description: "Find related works and discover new artists with our visual similarity search technology."
    },
    {
      icon: "📊",
      title: "Content Insights",
      description: "Track engagement, views, and interactions with detailed analytics dashboards."
    },
    {
      icon: "💾",
      title: "Digital Preservation",
      description: "Secure, high-quality storage ensuring your creative works stand the test of time."
    },
    {
      icon: "👥",
      title: "Community Collaboration",
      description: "Connect with fellow creators, share feedback, and collaborate on projects."
    },
    {
      icon: "🎨",
      title: "Multi-Format Support",
      description: "Upload and display various creative formats including images, writing, and performance videos."
    }
  ];

  return (
    <section id="features" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Revolutionary Features for <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Creative Minds</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Experience the future of digital creativity with our cutting-edge platform features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:transform hover:scale-105"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;