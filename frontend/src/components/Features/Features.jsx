import React from "react";
import {
  Brain,
  Search,
  BarChart3,
  Database,
  Users,
  Palette,
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <Brain className="w-10 h-10 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" />,
      title: "AI-Powered Discovery",
      description:
        "Intelligent recommendations and automatic content tagging powered by advanced AI algorithms.",
    },
    {
      icon: <Search className="w-10 h-10 text-pink-400 group-hover:text-pink-300 transition-colors duration-300" />,
      title: "Similarity Search",
      description:
        "Find related works and discover new artists with our visual similarity search technology.",
    },
    {
      icon: <BarChart3 className="w-10 h-10 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />,
      title: "Content Insights",
      description:
        "Track engagement, views, and interactions with detailed analytics dashboards.",
    },
    {
      icon: <Database className="w-10 h-10 text-green-400 group-hover:text-green-300 transition-colors duration-300" />,
      title: "Digital Preservation",
      description:
        "Secure, high-quality storage ensuring your creative works stand the test of time.",
    },
    {
      icon: <Users className="w-10 h-10 text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300" />,
      title: "Community Collaboration",
      description:
        "Connect with fellow creators, share feedback, and collaborate on projects.",
    },
    {
      icon: <Palette className="w-10 h-10 text-orange-400 group-hover:text-orange-300 transition-colors duration-300" />,
      title: "Multi-Format Support",
      description:
        "Upload and display various creative formats including images, writing, and performance videos.",
    },
  ];

  return (
    <section id="features" className="py-24 px-6 relative overflow-hidden">
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-slate-900 to-slate-900 -z-10" />
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -z-10 animate-pulse" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            Revolutionary Features for{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Creative Minds
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Experience the future of digital creativity with our cutting-edge
            platform features.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-purple-400/40 transition-all duration-500 hover:scale-105 hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.4)]"
              style={{
                animation: `fadeInUp 0.6s ease forwards`,
                animationDelay: `${index * 0.15}s`,
                opacity: 0,
              }}
            >
              {/* Icon */}
              <div className="mb-6">{feature.icon}</div>

              {/* Title */}
              <h3 className="text-2xl font-semibold text-white mb-3">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Keyframes for Stagger Animation */}
      <style>
        {`
          @keyframes fadeInUp {
            0% { transform: translateY(20px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
        `}
      </style>
    </section>
  );
};

export default Features;
