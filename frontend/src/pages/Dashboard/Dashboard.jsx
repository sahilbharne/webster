import React from 'react';

const Dashboard = () => {
  const stats = [
    { 
      label: 'Artworks Viewed', 
      value: '1,234', 
      change: '+12%',
      trend: 'up',
      icon: '👁️'
    },
    { 
      label: 'Collections', 
      value: '24', 
      change: '-3',
      trend: 'down',
      icon: '🖼️'
    },
    { 
      label: 'Artists Followed', 
      value: '56', 
      change: '-8',
      trend: 'down',
      icon: '👨‍🎨'
    },
    { 
      label: 'User Given', 
      value: '892', 
      change: '+45',
      trend: 'up',
      icon: '⭐'
    }
  ];

  const activities = [
    { action: 'Used ‘Sunset Dreams’', time: '2h ago', icon: '🎨' },
    { action: 'Followed Artist @digital_dave', time: '2h ago', icon: '➕' },
    { action: 'Created Collection ‘Nature’', time: '2h ago', icon: '📁' },
    { action: 'Connected on ‘Urban Art’', time: '2h ago', icon: '🔗' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Your <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Dashboard</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Track your art journey and statistics in one place
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:transform hover:scale-105"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl">{stat.icon}</div>
                <span className={`text-sm font-semibold ${
                  stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">{stat.value}</h3>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
            <button className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors">
              View All →
            </button>
          </div>

          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all duration-300 group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all duration-300">
                    <span className="text-lg">{activity.icon}</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{activity.action}</p>
                    <p className="text-gray-400 text-sm">{activity.time}</p>
                  </div>
                </div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Quick Actions */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-xl text-white transition-all duration-300 hover:transform hover:scale-105">
                <span className="text-lg block mb-2">🎨</span>
                Upload Art
              </button>
              <button className="p-4 bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/30 rounded-xl text-white transition-all duration-300 hover:transform hover:scale-105">
                <span className="text-lg block mb-2">🖼️</span>
                New Collection
              </button>
              <button className="p-4 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-xl text-white transition-all duration-300 hover:transform hover:scale-105">
                <span className="text-lg block mb-2">🔍</span>
                Discover Art
              </button>
              <button className="p-4 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 rounded-xl text-white transition-all duration-300 hover:transform hover:scale-105">
                <span className="text-lg block mb-2">👥</span>
                Find Artists
              </button>
            </div>
          </div>

          {/* Recent Views */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">Recently Viewed</h3>
            <div className="space-y-3">
              {['Abstract Dreams', 'Ocean Waves', 'Mountain Peak', 'City Lights'].map((art, index) => (
                <div key={index} className="flex items-center justify-between p-3 hover:bg-white/5 rounded-lg transition-colors">
                  <span className="text-gray-300">{art}</span>
                  <span className="text-gray-500 text-sm">Today</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;