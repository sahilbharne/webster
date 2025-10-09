import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      setLoading(false);
    }
  }, [isLoaded]);

  // Get user initial for avatar fallback
  const getUserInitial = () => {
    if (user?.firstName) {
      return user.firstName.charAt(0).toUpperCase();
    }
    return user?.username?.charAt(0).toUpperCase() || 'U';
  };

  if (!isLoaded || loading) {
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
                className="w-32 h-32 rounded-full border-4 border-white/20 shadow-2xl object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div 
                className="w-32 h-32 rounded-full border-4 border-white/20 shadow-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold hidden"
              >
                {getUserInitial()}
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            </div>
            
            {/* User Info */}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">
                    {user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User Name'}
                  </h1>
                  <p className="text-gray-400 text-lg mb-2">
                    @{user.username || user.primaryEmailAddress?.emailAddress?.split('@')[0] || 'user'}
                  </p>
                  <p className="text-gray-300 max-w-2xl">
                    {user.publicMetadata?.bio || 'No bio added yet.'}
                  </p>
                </div>
                <div className="mt-4 lg:mt-0 flex flex-col space-y-2">
                  <Link 
                    to="/user-profile"
                    className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 border border-white/20 hover:border-white/40 flex items-center space-x-2 justify-center"
                  >
                    <span>👁️</span>
                    <span>View Public Profile</span>
                  </Link>
                  <Link 
                    to="/edit-profile"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 flex items-center space-x-2 justify-center"
                  >
                    <span>⚙️</span>
                    <span>Edit Profile</span>
                  </Link>
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex flex-wrap gap-4 mt-6 text-gray-300">
                {user.primaryEmailAddress && (
                  <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full">
                    <span>📧</span>
                    <span className="text-sm">{user.primaryEmailAddress.emailAddress}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full">
                  <span>📅</span>
                  <span className="text-sm">
                    Joined {new Date(user.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                {user.publicMetadata?.website && (
                  <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full">
                    <span>🌐</span>
                    <a 
                      href={user.publicMetadata.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm hover:text-purple-300 transition-colors"
                    >
                      {user.publicMetadata.website}
                    </a>
                  </div>
                )}
                {user.publicMetadata?.location && (
                  <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full">
                    <span>📍</span>
                    <span className="text-sm">{user.publicMetadata.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link 
            to="/upload"
            className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-300 group text-center"
          >
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🎨</div>
            <h3 className="text-white font-semibold mb-2">Upload Artwork</h3>
            <p className="text-gray-400 text-sm">Share your latest creation</p>
          </Link>

          <Link 
            to="/collections"
            className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-300 group text-center"
          >
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📚</div>
            <h3 className="text-white font-semibold mb-2">Collections</h3>
            <p className="text-gray-400 text-sm">Organize your artworks</p>
          </Link>

          <Link 
            to="/settings"
            className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-green-500/50 hover:bg-green-500/10 transition-all duration-300 group text-center"
          >
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">⚙️</div>
            <h3 className="text-white font-semibold mb-2">Settings</h3>
            <p className="text-gray-400 text-sm">Manage account preferences</p>
          </Link>

          <Link 
            to="/saved"
            className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-yellow-500/50 hover:bg-yellow-500/10 transition-all duration-300 group text-center"
          >
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">⭐</div>
            <h3 className="text-white font-semibold mb-2">Saved Items</h3>
            <p className="text-gray-400 text-sm">Your favorite artworks</p>
          </Link>
        </div>

        {/* Profile Information Card */}
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <span className="mr-3">📋</span>
            Profile Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm block mb-2">Full Name</label>
                <p className="text-white font-semibold">
                  {user.fullName || 'Not set'}
                </p>
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-2">Username</label>
                <p className="text-white font-semibold">
                  @{user.username || 'Not set'}
                </p>
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-2">Email Address</label>
                <p className="text-white">
                  {user.primaryEmailAddress?.emailAddress || 'Not set'}
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm block mb-2">Bio</label>
                <p className="text-white">
                  {user.publicMetadata?.bio || 'No bio added yet. Share something about yourself!'}
                </p>
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-2">Website</label>
                <p className="text-white">
                  {user.publicMetadata?.website ? (
                    <a 
                      href={user.publicMetadata.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-purple-300 hover:text-purple-200 transition-colors"
                    >
                      {user.publicMetadata.website}
                    </a>
                  ) : 'Not set'}
                </p>
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-2">Location</label>
                <p className="text-white">
                  {user.publicMetadata?.location || 'Not set'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/edit-profile"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 flex items-center space-x-2 justify-center"
              >
                <span>✏️</span>
                <span>Edit Profile Details</span>
              </Link>
              <Link 
                to="/user-profile"
                className="bg-white/10 text-white px-8 py-3 rounded-full font-semibold hover:bg-white/20 transition-all duration-300 flex items-center space-x-2 justify-center border border-white/20"
              >
                <span>👁️</span>
                <span>View Public Profile</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;