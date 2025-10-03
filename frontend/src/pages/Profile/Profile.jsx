import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { artworkAPI } from "../../utils/api";

const Profile = () => {
  const { user, isLoaded } = useUser();
  const [userStats, setUserStats] = useState({
    artworks: 0,
    followers: 0,
    following: 0,
    collections: 0
  });
  const [recentArtworks, setRecentArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      fetchUserData();
    }
  }, [isLoaded, user]);

  const fetchUserData = async () => {
    try {
      // Mock data - replace with actual API calls
      setUserStats({
        artworks: user?.publicMetadata?.artworksCount || 24,
        followers: user?.publicMetadata?.followersCount || 1200,
        following: user?.publicMetadata?.followingCount || 156,
        collections: user?.publicMetadata?.collectionsCount || 8
      });

      setRecentArtworks([
        { id: 1, title: "Digital Dreams", likes: "234", views: "1.2K" },
        { id: 2, title: "Urban Nights", likes: "189", views: "987" },
        { id: 3, title: "Nature's Call", likes: "312", views: "2.1K" },
      ]);

    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: "Artworks", value: userStats.artworks, icon: "🖼️" },
    { label: "Followers", value: userStats.followers.toLocaleString(), icon: "👥" },
    { label: "Following", value: userStats.following, icon: "👤" },
    { label: "Collections", value: userStats.collections, icon: "📚" },
  ];

  // Get user initial for avatar fallback
  const getUserInitial = () => {
    if (user?.firstName) {
      return user.firstName.charAt(0).toUpperCase();
    }
    return 'U';
  };

  if (!isLoaded) {
    return (
      <div className="pt-20 pb-10 px-6">
        <div className="container mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="text-gray-300 mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="pt-20 pb-10 px-6">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Profile Not Found</h1>
          <p className="text-gray-300 text-lg mb-8">Please sign in to view your profile</p>
          <Link 
            to="/login" 
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-10 px-6">
      <div className="container mx-auto max-w-4xl">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-8 border border-white/10 mb-8 backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
            {/* Profile Picture */}
            <div className="relative">
              <img 
                src={user.imageUrl} 
                alt="Profile" 
                className="w-32 h-32 rounded-full border-4 border-white/20 shadow-2xl"
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            </div>
            
            {/* User Info */}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">
                    {user.fullName || 'User Name'}
                  </h1>
                  <p className="text-gray-400 text-lg mb-2">
                    @{user.username || user.primaryEmailAddress?.emailAddress?.split('@')[0]}
                  </p>
                  <p className="text-gray-300 max-w-2xl">
                    {user.publicMetadata?.bio || 'Digital artist creating dreams and realities through pixels and imagination.'}
                  </p>
                </div>
                <div className="mt-4 lg:mt-0">
                  <Link 
                    to="/dashboard"
                    className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 border border-white/20 hover:border-white/40 flex items-center space-x-2"
                  >
                    <span>⚙️</span>
                    <span>Edit Profile</span>
                  </Link>
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex flex-wrap gap-4 mt-4 text-gray-300">
                {user.primaryEmailAddress && (
                  <div className="flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full">
                    <span>📧</span>
                    <span className="text-sm">{user.primaryEmailAddress.emailAddress}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full">
                  <span>📅</span>
                  <span className="text-sm">
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {user.publicMetadata?.website && (
                  <div className="flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full">
                    <span>🌐</span>
                    <span className="text-sm">{user.publicMetadata.website}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                <div className="text-2xl mb-2">{stat.icon}</div>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Content Tabs */}
        <div className="flex space-x-1 bg-white/5 rounded-2xl p-1 border border-white/10 mb-8">
          {['Artworks', 'Collections', 'Likes', 'Activity'].map((tab) => (
            <button
              key={tab}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                tab === 'Artworks' 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Recent Artworks */}
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <span className="mr-3">🎨</span>
              Recent Artworks
            </h2>
            <Link 
              to="/upload"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full font-semibold text-sm hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 flex items-center space-x-2"
            >
              <span>+</span>
              <span>Upload New</span>
            </Link>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
              <p className="text-gray-300 mt-2">Loading artworks...</p>
            </div>
          ) : recentArtworks.length > 0 ? (
            <div className="space-y-4">
              {recentArtworks.map((artwork) => (
                <div 
                  key={artwork.id} 
                  className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
                      {getUserInitial()}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg group-hover:text-purple-300 transition-colors">
                        {artwork.title}
                      </h3>
                      <div className="flex space-x-4 text-gray-400 text-sm mt-1">
                        <span className="flex items-center space-x-1">
                          <span>❤️</span>
                          <span>{artwork.likes}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <span>👁️</span>
                          <span>{artwork.views}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-purple-400 hover:text-purple-300 text-sm font-medium px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300">
                      Edit
                    </button>
                    <button className="text-gray-300 hover:text-white text-sm font-medium px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300">
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎨</div>
              <h3 className="text-xl font-bold text-white mb-2">No Artworks Yet</h3>
              <p className="text-gray-400 mb-6">Start your artistic journey by uploading your first artwork</p>
              <Link 
                to="/upload"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 inline-flex items-center space-x-2"
              >
                <span>+</span>
                <span>Upload Your First Artwork</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;